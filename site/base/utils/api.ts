export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1';

export interface ApiFetchOptions extends RequestInit {
  /**
   * Skip the global "401 -> wipe session and bounce to /login" behaviour. Needed on the
   * login page itself, where a 401 is a failed sign-in whose message must stay on screen.
   */
  skipAuthRedirect?: boolean;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const { skipAuthRedirect, ...fetchOptions } = options;
  
  let headers = {
    ...options.headers,
  } as any;

  if (!(fetchOptions.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (typeof window !== 'undefined') {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const token = parsed?.state?.token;
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (_) {}
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401 && !skipAuthRedirect) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    let errorMessage = `HTTP error! Status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.detail) {
        errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
      }
    } catch (_) {}
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
