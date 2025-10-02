import { http } from './http.js';
import { getApiConfig } from './config.js';

const path = (p) => `${getApiConfig().prontuarioBaseUrl}${p}`;

export const animalsApi = {
  create: (data) => http.post(path('/animais'), data),
  get: (id) => http.get(path(`/animais/${id}`)),
  remove: (id) => http.del(path(`/animais/${id}`)),
  inactivate: (id) => http.put(path(`/animais/${id}/inativar`), {}),
  exists: (id) => http.get(path(`/animais/${id}/exists`)),
};

export const consultasApi = {
  create: (animalId, data) => http.post(path(`/animais/${animalId}/consultas`), data),
  list: (animalId) => http.get(path(`/animais/${animalId}/consultas`)),
};

export const examesApi = {
  create: (animalId, data) => http.post(path(`/animais/${animalId}/exames`), data),
  list: (animalId) => http.get(path(`/animais/${animalId}/exames`)),
};


