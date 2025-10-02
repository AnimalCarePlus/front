let API_CONFIG = {
  vacinasBaseUrl: '',
  prontuarioBaseUrl: '',
  agendamentoBaseUrl: '',
};

export function configureApis(config) {
  API_CONFIG = { ...API_CONFIG, ...config };
}

export function getApiConfig() {
  return API_CONFIG;
}


