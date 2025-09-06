export function buildCors(): Record<string, string> {
  const site = Deno.env.get('SITE_URL') || '*'
  return {
    'Access-Control-Allow-Origin': site,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  }
}

