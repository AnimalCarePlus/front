import { buildDashboard } from './dashboard.js';

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
  const title = document.createElement('h1');
  title.textContent = 'Clínica Vet - Portal';
  const tokenBox = document.createElement('input');
  tokenBox.placeholder = 'Cole o token JWT aqui...';
  tokenBox.value = sessionStorage.getItem('token') || '';
  tokenBox.addEventListener('change', () => sessionStorage.setItem('token', tokenBox.value));
  h.appendChild(title);
  h.appendChild(tokenBox);
  return h;
}


