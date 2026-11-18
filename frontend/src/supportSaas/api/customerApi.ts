const API_ROOT = '/api/support-saas';
export class CustomerApiError extends Error {
  /** Retains only the public server message and HTTP status. */
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
/** Sends only fixed same-origin customer requests; no native tokens or tenant identifiers are accepted. */
export async function customerRequest<T>(
  path: string,
  body?: object,
): Promise<T> {
  const response = await fetch(`${API_ROOT}${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    credentials: 'same-origin',
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(30_000),
    headers: { 'Content-Type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new CustomerApiError(
      response.status,
      typeof data.error === 'string' ? data.error : '',
    );
  return data as T;
}
