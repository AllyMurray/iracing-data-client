/**
 * Test utilities for creating properly typed mock responses.
 */

/**
 * Create a real Response object for use in tests.
 *
 * @param body - The response body (will be JSON-stringified if not a string)
 * @param options - Optional overrides for status, statusText, ok, and headers
 */
export function createMockResponse(
  body: unknown,
  options: {
    ok?: boolean;
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
  } = {},
): Response {
  const {
    ok = true,
    status = ok ? 200 : 500,
    statusText = ok ? "OK" : "Internal Server Error",
    headers = { "content-type": "application/json" },
  } = options;

  const responseBody = typeof body === "string" ? body : JSON.stringify(body);

  return new Response(responseBody, {
    status,
    statusText,
    headers: new Headers(headers),
  });
}
