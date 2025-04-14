const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
};

export function responseJSON(
  data: Record<string, unknown>,
  status = 200,
  headers?: HeadersInit
): Response {
  const _body = JSON.stringify(data);

  return new Response(_body, {
    status,
    headers: {
      ...headers,
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

export function parseCacheTTL(value: string | undefined, defaultValue: number) {
  if (!value) {
    return defaultValue;
  }

  const ttl = Number.parseInt(value);
  if (Number.isNaN(ttl)) {
    return 3 * 60 * 60;
  }

  return ttl;
}
