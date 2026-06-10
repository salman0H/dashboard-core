// All HTTP calls go through this service.
// Components never call fetch() directly.
// Responses are typed; errors bubble to React Error Boundaries.

const BASE = '/api'

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: 'same-origin',
  })
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`)
  }
  return res.json() as Promise<T>
}

export const apiService = {
  get: <T>(path: string): Promise<T> => request<T>(path),
}
