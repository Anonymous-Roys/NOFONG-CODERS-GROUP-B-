export const API_BASE = 'https://nofong-coders-group-b.onrender.com';
// export const API_BASE = 'http://localhost:3000';

export async function apiFetch(path: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    
    const contentType = res.headers.get('content-type') || '';
    const body = contentType.includes('application/json') ? await res.json() : await res.text();
    
    if (!res.ok) {
      const message = typeof body === 'string' ? body : body?.message || `Request failed with status ${res.status}`;
      const error = new Error(message);
      (error as any).status = res.status;
      (error as any).field = body?.field;
      throw error;
    }
    
    return body;
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw err;
  }
}

export function parseJwt<T = any>(token: string): T | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload) as T;
  } catch {
    return null;
  }
}


