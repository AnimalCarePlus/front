import { stockApi } from '../../services/vaccinesApi.js';

export function StockPanel() {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = '<h2>Estoque</h2>';

  const form = document.createElement('div');
  form.className = 'form-grid';
  const vaccineId = field('ID Vacina', input('ID Vacina'));
  const batchNumber = field('Lote', input('Lote'));
  const expirationDate = field('Validade (YYYY-MM-DD)', input('Validade (YYYY-MM-DD)'));
  const quantity = field('Quantidade', input('Quantidade', 'number'));
  const actions = document.createElement('div'); actions.className = 'actions';
  const createBtn = button('Adicionar', async () => {
    await stockApi.create({ vaccineId: vaccineId.value, batchNumber: batchNumber.value, expirationDate: expirationDate.value, quantity: Number(quantity.value) });
    await refresh();
  });
  actions.append(createBtn);
  const tools = document.createElement('div');
  tools.className = 'tools';
  const lowBtn = button('Alertas: Baixo estoque', async () => {
    const data = await stockApi.alertsLow(5); out.innerText = JSON.stringify(data, null, 2);
  });
  const expBtn = button('Alertas: Próximo vencimento', async () => {
    const data = await stockApi.alertsExpiry(30); out.innerText = JSON.stringify(data, null, 2);
  });
  tools.append(lowBtn, expBtn);

  const list = document.createElement('div');
  const out = document.createElement('pre');
  out.className = 'card';
  out.style.background = '#0a1424';

  form.append(vaccineId.wrapper, batchNumber.wrapper, expirationDate.wrapper, quantity.wrapper, actions);
  card.append(form, tools, list, out);

  async function refresh() {
    list.innerHTML = '<span class="pill">Carregando...</span>';
    try {
      const data = await stockApi.list();
      list.innerHTML = '';
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      thead.innerHTML = '<tr><th>Vacina</th><th>Lote</th><th>Validade</th><th>Qtd</th><th></th></tr>';
      const tbody = document.createElement('tbody');
      data.forEach((s) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${s.vaccineId || ''}</td><td>${s.batchNumber || ''}</td><td>${s.expirationDate || ''}</td><td>${s.quantity || ''}</td>`;
        const tdActions = document.createElement('td');
        const del = button('Excluir', async () => { await stockApi.remove(s._id || s.id); await refresh(); });
        tdActions.appendChild(del);
        tr.appendChild(tdActions);
        tbody.appendChild(tr);
      });
      table.append(thead, tbody);
      list.appendChild(table);
    } catch (e) {
      list.innerHTML = `<span class="error">Erro: ${e.message}</span>`;
    }
  }

  refresh();
  return card;
}

function input(placeholder, type = 'text') { const i = document.createElement('input'); i.placeholder = placeholder; i.type = type; return i; }
function field(labelText, inputEl) { const wrap = document.createElement('div'); wrap.className = 'field'; const label = document.createElement('label'); label.className = 'label'; label.textContent = labelText; wrap.append(label, inputEl); return new Proxy(inputEl, { get: (t, p) => (p === 'wrapper' ? wrap : t[p]) }); }
function button(text, onClick) { const b = document.createElement('button'); b.className = 'primary'; b.textContent = text; b.addEventListener('click', onClick); return b; }


