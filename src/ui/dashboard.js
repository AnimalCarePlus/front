import { VaccinesPanel } from './panels/vaccines.js';
import { StockPanel } from './panels/stock.js';
import { ApplicationsPanel } from './panels/applications.js';
import { AnimalsPanel } from './panels/animals.js';
import { ConsultasPanel } from './panels/consultas.js';

export function buildDashboard() {
  const wrapper = document.createElement('div');
  const tabs = [
    { id: 'vaccines', label: 'Vacinas', view: VaccinesPanel },
    { id: 'stock', label: 'Estoque', view: StockPanel },
    { id: 'applications', label: 'Aplicações', view: ApplicationsPanel },
    { id: 'animals', label: 'Prontuário - Animais', view: AnimalsPanel },
    { id: 'consultas', label: 'Prontuário - Consultas', view: ConsultasPanel },
  ];

  const nav = document.createElement('div');
  nav.className = 'tabs';
  tabs.forEach((t, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab';
    btn.textContent = t.label;
    btn.addEventListener('click', () => renderTab(t.id));
    if (i === 0) btn.dataset.default = 'true';
    nav.appendChild(btn);
  });

  const area = document.createElement('div');
  wrapper.appendChild(nav);
  wrapper.appendChild(area);

  function renderTab(id) {
    area.innerHTML = '';
    const tab = tabs.find((t) => t.id === id) || tabs[0];
    area.appendChild(tab.view());
    Array.from(nav.children).forEach((b) => b.classList.toggle('active', b.textContent === tab.label));
  }

  renderTab(tabs[0].id);
  return wrapper;
}


