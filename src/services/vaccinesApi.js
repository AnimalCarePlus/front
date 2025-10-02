import { http } from './http.js';
import { getApiConfig } from './config.js';

const path = (p) => `${getApiConfig().vacinasBaseUrl}${p}`;

export const vaccinesApi = {
  list: () => http.get(path('/vacinas')),           
  create: (data) => http.post(path('/vacinas'), data),
  update: (id, data) => http.put(path(`/vacinas/${id}`), data),
  remove: (id) => http.del(path(`/vacinas/${id}`)),
};

export const stockApi = {
  list: () => http.get(path('/stock')),
  create: (data) => http.post(path('/stock'), data),
  update: (id, data) => http.put(path(`/stock/${id}`), data),
  remove: (id) => http.del(path(`/stock/${id}`)),
  alertsLow: (threshold) => http.get(path(`/stock/alerts/low-stock?threshold=${threshold ?? ''}`)),
  alertsExpiry: (days) => http.get(path(`/stock/alerts/near-expiry?days=${days ?? ''}`)),
};

export const applicationsApi = {
  apply: (payload) => http.post(path('/applications/apply'), payload),
};