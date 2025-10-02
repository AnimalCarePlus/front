const DEFAULT_TIMEOUT_MS = 8000; // 8s

function jsonSafeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function httpRequest(url, options = {}) {
  const controller = new AbortController();
  const timeoutMs = options.timeout ?? DEFAULT_TIMEOUT_MS;
  const signal = controller.signal;

  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) {
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  }

  const token = sessionStorage.getItem('token');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const fetchOptions = {
    ...options,
    headers,
    signal,
    mode: options.mode ?? 'cors',
    credentials: options.credentials ?? 'same-origin'
  };

  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      throw new Error(`Requisição para ${url} excedeu o tempo (${timeoutMs}ms).`);
    }
    if (err instanceof TypeError) {
      throw new Error(`Erro de rede ao tentar conectar com ${url}. Verifique se o backend está rodando e se CORS está habilitado.`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }

  const contentType = response.headers.get('content-type') || '';
  let data = null;
  try {
    if (contentType.includes('application/json')) {
      data = await response.json().catch(() => null);
    } else {
      data = await response.text().catch(() => null);
      const parsed = jsonSafeParse(data);
      if (parsed !== null) data = parsed;
    }
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const message =
      typeof data === 'string'
        ? data
        : data?.message ||
          `${response.status} ${response.statusText}` ||
          'Erro desconhecido do servidor';
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  return data;
}

export const http = {
  get: (url, opts = {}) => httpRequest(url, { ...opts, method: 'GET' }),
  post: (url, body, opts = {}) => {
    const o = { ...opts, method: 'POST' };
    if (body instanceof FormData) o.body = body;
    else o.body = JSON.stringify(body);
    return httpRequest(url, o);
  },
  put: (url, body, opts = {}) => {
    const o = { ...opts, method: 'PUT' };
    if (body instanceof FormData) o.body = body;
    else o.body = JSON.stringify(body);
    return httpRequest(url, o);
  },
  del: (url, opts = {}) => httpRequest(url, { ...opts, method: 'DELETE' }),
  head: (url, opts = {}) => httpRequest(url, { ...opts, method: 'HEAD' })
};