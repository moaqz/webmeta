const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
};

export function responseJSON(
  data: Record<string, unknown>,
  status = 200,
  headers?: HeadersInit,
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
