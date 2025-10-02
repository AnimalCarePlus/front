import { http } from './http.js';
import { getApiConfig } from './config.js';

const path = (p) => `${getApiConfig().agendamentoBaseUrl}${p}`;

export const agendamentoApi = {
  create: (data) => http.post(path('/consultas'), data),
  update: (id, data) => http.put(path(`/consultas/${id}`), data),
  get: (id) => http.get(path(`/consultas/${id}`)),
  listByVet: (veterinarioId) => http.get(path(`/consultas/veterinarios/${veterinarioId}`)),
  disponibilidade: (veterinarioId, dataIsoDate) =>
    http.get(path(`/consultas/disponibilidade?veterinarioId=${encodeURIComponent(veterinarioId)}&data=${encodeURIComponent(dataIsoDate)}`)),
};