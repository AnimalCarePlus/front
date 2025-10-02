import { buildDashboard } from './dashboard.js';
import { getApiConfig } from '../services/config.js';
import { http } from '../services/http.js';

export function createApp(root) {
  root.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'container';
  container.appendChild(header());
  container.appendChild(buildDashboard());
  root.appendChild(container);
}

function header() {
  const h = document.createElement('div');
  h.className = 'toolbar';

  const left = document.createElement('div');
  left.style.display = 'flex';
  left.style.alignItems = 'center';
  left.style.gap = '12px';

  const title = document.createElement('h1');
  title.textContent = 'Clínica Vet - Portal';

  left.appendChild(title);

  const tokenBox = document.createElement('input');
  tokenBox.placeholder = 'Cole o token JWT aqui...';
  tokenBox.value = sessionStorage.getItem('token') || '';
  tokenBox.addEventListener('change', () => sessionStorage.setItem('token', tokenBox.value));
  left.appendChild(tokenBox);

  const healthContainer = document.createElement('div');
  healthContainer.style.display = 'flex';
  healthContainer.style.gap = '8px';
  healthContainer.style.alignItems = 'center';
  healthContainer.style.marginLeft = '12px';

  left.appendChild(healthContainer);

  const refreshBtn = document.createElement('button');
  refreshBtn.textContent = 'Verificar APIs';
  refreshBtn.className = 'ghost';
  refreshBtn.addEventListener('click', () => checkApis(healthContainer, refreshBtn));
  left.appendChild(refreshBtn);

  h.appendChild(left);

  checkApis(healthContainer);

  return h;
}

function makePill(text, color = null) {
  const p = document.createElement('span');
  p.className = 'pill';
  p.textContent = text;
  if (color) p.style.borderColor = color;
  return p;
}

async function checkApis(container, btn) {
  container.innerHTML = '';
  const cfg = getApiConfig();
  const entries = [
    { key: 'vacinas', url: cfg.vacinasBaseUrl },
    { key: 'prontuario', url: cfg.prontuarioBaseUrl },
    { key: 'agendamento', url: cfg.agendamentoBaseUrl }
  ];

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Verificando...';
  }

  await Promise.all(
    entries.map(async (e) => {
      const label = document.createElement('div');
      label.style.display = 'flex';
      label.style.flexDirection = 'column';
      label.style.alignItems = 'flex-start';
      label.style.gap = '4px';

      const title = document.createElement('small');
      title.textContent = e.key;
      title.style.color = 'var(--muted)';
      title.style.fontSize = '11px';

      let pill;
      if (!e.url) {
        pill = makePill('não configurado', '#6b6b6b');
      } else {
        pill = makePill('...'); 
        try {
          const healthUrls = [e.url.replace(/\/+$/, '') + '/health', e.url.replace(/\/+$/, '') + '/', e.url];
          let ok = false;
          let info = null;
          for (const hu of healthUrls) {
            try {
              const res = await http.head(hu, { timeout: 3000 });
              ok = true;
              info = typeof res === 'object' ? JSON.stringify(res) : String(res);
              break;
            } catch (err) {
            }
          }
          if (ok) {
            pill.textContent = 'ok';
            pill.style.borderColor = 'green';
            pill.title = `Resposta de ${e.url}`;
          } else {
            pill.textContent = 'down';
            pill.style.borderColor = 'red';
            pill.title = `Não respondeu: ${e.url} — verifique se o serviço está rodando e se CORS está habilitado`;
          }
        } catch (err) {
          pill.textContent = 'erro';
          pill.style.borderColor = 'red';
          pill.title = err.message;
        }
      }

      label.appendChild(title);
      label.appendChild(pill);
      container.appendChild(label);
    })
  );

  if (btn) {
    btn.disabled = false;
    btn.textContent = 'Verificar APIs';
  }
}