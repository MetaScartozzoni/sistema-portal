import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// Sentry será carregado dinamicamente apenas se SENTRY_DSN existir
let Sentry: any | null = null

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Níveis de log permitidos
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  time: string
  event: string
  msg?: string
  meta?: Record<string, unknown>
}

const LOG_LEVELS: LogLevel[] = ['debug','info','warn','error']

function shouldLog(target: LogLevel, current: LogLevel): boolean {
  return LOG_LEVELS.indexOf(target) >= LOG_LEVELS.indexOf(current)
}

function loggerFactory(format: string, level: LogLevel, requestId: string) {
  return (entry: Omit<LogEntry,'time'> & { time?: string }) => {
    if (!shouldLog(entry.level, level)) return
    const payload: LogEntry = {
      level: entry.level,
      time: entry.time || new Date().toISOString(),
      event: entry.event,
      msg: entry.msg,
      meta: { request_id: requestId, ...(entry.meta || {}) }
    }
    if (format === 'json') {
      console.log(JSON.stringify(payload))
    } else {
      // formato legível
      console.log(`[${payload.time}] [${payload.level.toUpperCase()}] ${payload.event} - ${payload.msg || ''}`,
        payload.meta ? JSON.stringify(payload.meta) : '')
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTs = Date.now()
  // request id (idempotência observabilidade)
  const requestId = crypto.randomUUID?.() || Math.random().toString(36).slice(2)
  try {
    // Base config
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY')
  const edgeCronToken = Deno.env.get('EDGE_CRON_TOKEN') || ''
  const defaultWebhook = Deno.env.get('LEAD_ALERT_WEBHOOK_URL') || ''
  const logFormat = (Deno.env.get('LOG_FORMAT') || 'text').toLowerCase()
  const logLevel = (Deno.env.get('LOG_LEVEL') || 'info').toLowerCase() as LogLevel
    const log = loggerFactory(logFormat, LOG_LEVELS.includes(logLevel)? logLevel : 'info', requestId)

    // Carregar Sentry uma única vez
    if (!Sentry && Deno.env.get('SENTRY_DSN')) {
      try {
        // deno-lint-ignore no-var-requires
        Sentry = await import('npm:@sentry/deno')
        Sentry.init({ dsn: Deno.env.get('SENTRY_DSN'), tracesSampleRate: 0.1 })
        log({ level:'info', event:'sentry.init', msg:'Sentry inicializado' })
      } catch (e) {
        log({ level:'warn', event:'sentry.init.fail', msg:'Falha ao carregar Sentry', meta:{ error: (e as Error).message } })
      }
    }

  // Usar cabeçalho customizado para não conflitar com validação JWT do gateway
  const rawAuthHeader = req.headers.get('authorization') || ''
  const bearerToken = rawAuthHeader.startsWith('Bearer ') ? rawAuthHeader.substring(7).trim() : ''
  const edgeHeader = req.headers.get('x-edge-token')?.trim() || ''
  // Aceita: Authorization: Bearer EDGE_CRON_TOKEN OU x-edge-token: EDGE_CRON_TOKEN
  const authHeader = edgeHeader || bearerToken

    // Simple auth: MUST provide valid EDGE_CRON_TOKEN. (Service key never required in request)
  if (!authHeader || authHeader !== edgeCronToken) {
      return new Response(
        JSON.stringify({
          success: false,
      error: 'Unauthorized',
      hint: 'Provide x-edge-token header with EDGE_CRON_TOKEN',
            timestamp: new Date().toISOString()
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  if (!serviceKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing service role key in environment', timestamp: new Date().toISOString() }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

  log({ level:'info', event:'startup', msg:'Lead Alert Worker - Edge Function', meta:{ ts: new Date().toISOString(), format: logFormat, level: logLevel, request_id: requestId } })
    
  // SLA thresholds (em horas) - permitem override via header para testes: x-sla-1h, x-sla-4h, x-sla-24h
  const SLA_1H = parseFloat(req.headers.get('x-sla-1h') || '1')
  const SLA_4H = parseFloat(req.headers.get('x-sla-4h') || '4')
  const SLA_24H = parseFloat(req.headers.get('x-sla-24h') || '24')

  // Limite máximo configurável
  const MAX_MESSAGES = parseInt(Deno.env.get('MAX_MESSAGES') || '500', 10)
  const SAFE_TIMEOUT_MS = parseInt(Deno.env.get('SAFE_TIMEOUT_MS') || String(9 * 60 * 1000), 10) // 9 min

  log({ level:'debug', event:'sla.config', meta:{ sla_1h:SLA_1H, sla_4h:SLA_4H, sla_24h:SLA_24H } })

    // Buscar mensagens não atribuídas (leads aguardando resposta)
    const { data: unassignedMessages, error: messagesError } = await supabase
      .from('ai_messages')
      .select('id,conversation_id,user_id,content,created_at,channel,direction,status,assigned_user_id')
      .eq('direction', 'inbound')
      .or('assigned_user_id.is.null,status.eq.new')
      .order('created_at', { ascending: true })
      .limit(MAX_MESSAGES)

    if (messagesError) {
      log({ level:'error', event:'query.messages', msg:'Erro ao buscar mensagens', meta:{ error: messagesError.message } })
      throw messagesError
    }

    const messages = unassignedMessages || []
  log({ level:'info', event:'analysis.start', msg:`Analisando mensagens`, meta:{ total: messages.length } })

    let alertsCount = 0
    let messagesNeedingResponse = 0
    const now = new Date()

  const alerts: any[] = []
    for (const message of messages) {
      if (Date.now() - startTs > SAFE_TIMEOUT_MS) {
        log({ level:'warn', event:'execution.timeout.soft', msg:'Tempo limite aproximando, encerrando processamento cedo', meta:{ processed: messagesNeedingResponse, alerts: alertsCount } })
        break
      }
      const messageTime = new Date(message.created_at)
      const hoursElapsed = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60)

      // Verificar se precisa de resposta (não tem resposta subsequente)
      const { data: responses } = await supabase
        .from('ai_messages')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', message.conversation_id)
        .eq('direction', 'outbound')
        .gt('created_at', message.created_at)
        .limit(1)

  const hasResponse = !!responses && responses.length > 0

      if (!hasResponse) {
        messagesNeedingResponse++
        
        let alertLevel = ''
        let shouldAlert = false

        if (hoursElapsed >= SLA_24H) {
          alertLevel = 'CRÍTICO (24h+)'
          shouldAlert = true
        } else if (hoursElapsed >= SLA_4H) {
          alertLevel = 'ALTO (4h+)'
          shouldAlert = true
        } else if (hoursElapsed >= SLA_1H) {
          alertLevel = 'MÉDIO (1h+)'
          shouldAlert = true
        }

        if (shouldAlert) {
          alertsCount++
          const alertPayload = {
            level: alertLevel,
            message_id: message.id,
            conversation_id: message.conversation_id,
            channel: message.channel,
            hours_elapsed: parseFloat(hoursElapsed.toFixed(2)),
            received_at: messageTime.toISOString(),
            preview: message.content?.substring(0,120) || null
          }
          alerts.push(alertPayload)
          log({ level:'warn', event:'sla.violation', meta: alertPayload })
        }
      }
    }

    // Suporte a modo de teste (gera alerta fake se header presente)
    if (req.headers.get('x-debug-fake-alert') === '1') {
      const fake = {
        level: 'TESTE',
        message_id: 'fake-id',
        conversation_id: 'fake-conv',
        channel: 'test',
        hours_elapsed: 5,
        received_at: new Date(Date.now() - 5*3600*1000).toISOString(),
        preview: 'Mensagem simulada para teste de webhook.'
      }
      alerts.push(fake)
      alertsCount++
      messagesNeedingResponse++
      log({ level:'debug', event:'test.alert.injected', meta: fake })
    }

    // Envio de webhook consolidado (se houver alertas)
  let webhookResult: { status?: number; ok?: boolean; error?: string } | undefined
    const overrideWebhook = req.headers.get('x-webhook-url') || ''
    const webhookUrl = overrideWebhook || defaultWebhook

    if (alerts.length > 0 && webhookUrl) {
      try {
        const body = {
          type: 'lead_alerts',
          project: supabaseUrl,
            total_alerts: alerts.length,
            generated_at: new Date().toISOString(),
            sla: { SLA_1H, SLA_4H, SLA_24H },
            alerts
        }
        const resp = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        webhookResult = { status: resp.status, ok: resp.ok }
        log({ level: resp.ok? 'info':'error', event:'webhook.dispatch', meta:{ status: resp.status, alerts: alerts.length, url_hash: webhookUrl.slice(0,30)+'...' } })
      } catch (e) {
        webhookResult = { ok: false, error: (e as Error).message }
        log({ level:'error', event:'webhook.error', meta:{ error: (e as Error).message } })
      }
    } else if (alerts.length > 0) {
      log({ level:'warn', event:'webhook.skipped', msg:'Webhook URL não configurada', meta:{ alerts: alerts.length } })
    }

  log({ level:'info', event:'analysis.summary', meta:{ total_messages: messages.length, needing_response: messagesNeedingResponse, alerts: alertsCount } })
  log({ level:'info', event:'finish', meta:{ status: alertsCount>0? 'violations_or_pending': (messagesNeedingResponse>0? 'pending':'all_clear') } })

    // Persistência opcional (best-effort) em lead_alert_runs / lead_alert_events
    let runId: string | undefined
    try {
      const durationMs = Date.now() - startTs
      // Inserir run
      const { data: runInsert, error: runErr } = await supabase
        .from('lead_alert_runs')
        .insert({
          request_id: requestId,
          total_messages: messages.length,
          needing_response: messagesNeedingResponse,
          alerts_triggered: alertsCount,
          status: messagesNeedingResponse === 0 ? 'all_clear' : alertsCount === 0 ? 'pending_within_sla' : 'sla_violations',
          duration_ms: durationMs,
          sla_1h: SLA_1H,
          sla_4h: SLA_4H,
          sla_24h: SLA_24H
        })
        .select('id')
        .single()
      if (!runErr && runInsert) {
        runId = (runInsert as any).id
        if (alerts.length > 0) {
          const bulk = alerts.map(a => ({
            run_id: runId,
            level: a.level,
            message_id: a.message_id,
            conversation_id: a.conversation_id,
            channel: a.channel,
            hours_elapsed: a.hours_elapsed,
            received_at: a.received_at,
            preview: a.preview
          }))
          const { error: eventsErr } = await supabase.from('lead_alert_events').insert(bulk)
          if (eventsErr) {
            log({ level:'warn', event:'persist.events.fail', msg:'Falha ao inserir eventos', meta:{ error: eventsErr.message } })
          } else {
            log({ level:'debug', event:'persist.events.ok', meta:{ count: bulk.length } })
          }
        }
        log({ level:'debug', event:'persist.run.ok', meta:{ run_id: runId } })
      } else if (runErr) {
        // Se tabela não existe ou erro de permissão, apenas loga
        log({ level:'warn', event:'persist.run.fail', msg:'Falha ao inserir execução', meta:{ error: runErr.message } })
      }
    } catch (e) {
      log({ level:'warn', event:'persist.exception', msg:'Exceção na persistência', meta:{ error: (e as Error).message } })
    }

    // Return response
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalMessages: messages.length,
        messagesNeedingResponse,
        alertsTriggered: alertsCount,
        slaThresholds: { SLA_1H, SLA_4H, SLA_24H }
      },
      alerts: alertsCount > 0 ? { total: alertsCount } : undefined,
      webhook: webhookResult,
      request_id: requestId,
      run_id: runId,
      status: messagesNeedingResponse === 0 ? 'all_clear' : 
              alertsCount === 0 ? 'pending_within_sla' : 'sla_violations'
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    const errObj = { level:'error', event:'fatal', time:new Date().toISOString(), error: (error as Error).message }
    console.error(JSON.stringify(errObj))
    if (Sentry) {
      try { Sentry.captureException(error) } catch(_) {}
    }
    // Webhook de erro rápido (se configurado ALERT_WEBHOOK_URL)
    const errorWebhook = Deno.env.get('ALERT_WEBHOOK_URL')
    if (errorWebhook) {
      try { await fetch(errorWebhook, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type:'worker_error', ...errObj }) }) } catch(_) {}
    }
    
    return new Response(
  JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
