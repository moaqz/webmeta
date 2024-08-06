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
      "Content-Type": "application/json",
    },
  });
}
