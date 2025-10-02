async function httpRequest(url, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  const token = sessionStorage.getItem('token');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(url, { ...options, headers, mode: 'cors' });
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.message || response.statusText;
    throw new Error(message);
  }
  return data;
}

export const http = {
  get: (url) => httpRequest(url),
  post: (url, body) => httpRequest(url, { method: 'POST', body: JSON.stringify(body) }),
  put: (url, body) => httpRequest(url, { method: 'PUT', body: JSON.stringify(body) }),
  del: (url) => httpRequest(url, { method: 'DELETE' }),
};


