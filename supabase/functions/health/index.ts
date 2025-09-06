import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders: Record<string,string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const start = Date.now();
  const requestId = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
  const url = new URL(req.url);
  const deep = url.searchParams.get('deep') === '1';

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY');

  let dbReachable: boolean | undefined;
  let dbLatencyMs: number | undefined;
  let dbError: string | undefined;

  if (deep && supabaseUrl) {
    try {
      const dbStart = Date.now();
      // Prefer anon key para minimizar privilégios; se não houver, usa service
      const key = anonKey || serviceKey;
      if (key) {
        const client = createClient(supabaseUrl, key, { auth: { autoRefreshToken: false, persistSession: false } });
        // Consulta leve (por segurança usa rpc de now() ou select simples)
        const { error } = await client.from('ai_messages').select('id', { count: 'exact', head: true }).limit(1);
        dbLatencyMs = Date.now() - dbStart;
        dbReachable = !error;
        if (error) dbError = error.message;
      } else {
        dbReachable = false;
        dbError = 'No key available';
      }
    } catch (e) {
      dbReachable = false;
      dbError = (e as Error).message;
    }
  }

  const body = {
    status: 'ok',
    mode: deep ? 'deep' : 'shallow',
    uptime_ms: undefined, // Edge function is stateless; left for parity if you add global start later
    request_id: requestId,
    runtime: 'deno-edge',
    timestamp: new Date().toISOString(),
    latency_ms: Date.now() - start,
    db: deep ? { reachable: dbReachable, latency_ms: dbLatencyMs, error: dbError } : undefined,
  };

  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    status: 200,
  });
});
