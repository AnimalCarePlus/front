import { createApp } from './ui/app.js';
import { configureApis } from './services/config.js';

configureApis({
  vacinasBaseUrl: 'http://localhost:3001/api',
  prontuarioBaseUrl: 'http://localhost:5000/api',
  agendamentoBaseUrl: 'http://localhost:9091/api',
});

createApp(document.getElementById('app'));