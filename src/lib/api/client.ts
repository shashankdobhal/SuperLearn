// EXPO_PUBLIC_-prefixed vars are inlined into the client bundle by Expo.
// Defaults to the local dev API server (see server/index.ts, `npm run server`).
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.error ?? `Request to ${path} failed`, res.status);
  }
  return res.json() as Promise<T>;
}
