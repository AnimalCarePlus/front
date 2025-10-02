import { vaccinesApi } from '../../services/vaccinesApi.js';

export function VaccinesPanel() {
  const card = document.createElement('div');
  card.className = 'card';
  const title = document.createElement('h2');
  title.textContent = 'Vacinas';
  card.appendChild(title);

  const list = document.createElement('div');
  const form = document.createElement('div');
  form.className = 'form-grid';

  const name = field('Nome', input('Nome'));
  const manufacturer = field('Fabricante', input('Fabricante'));
  const doses = field('Doses requeridas', input('Doses', 'number'));
  const actions = document.createElement('div');
  actions.className = 'actions';
  const createBtn = button('Criar', async () => {
    await vaccinesApi.create({ name: name.value, manufacturer: manufacturer.value, dosesRequired: Number(doses.value) });
    await refresh();
  });
  actions.append(createBtn);
  form.append(name.wrapper, manufacturer.wrapper, doses.wrapper, actions);
  card.appendChild(form);
  card.appendChild(list);

  async function refresh() {
    list.innerHTML = '<span class="pill">Carregando...</span>';
    try {
      const data = await vaccinesApi.list();
      list.innerHTML = '';
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      thead.innerHTML = '<tr><th>Nome</th><th>Fabricante</th><th>Doses</th><th></th></tr>';
      const tbody = document.createElement('tbody');
      data.forEach((v) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${v.name || ''}</td><td>${v.manufacturer || ''}</td><td>${v.dosesRequired || ''}</td>`;
        const tdActions = document.createElement('td');
        const del = button('Excluir', async () => { await vaccinesApi.remove(v._id || v.id); await refresh(); });
        tdActions.appendChild(del);
        tr.appendChild(tdActions);
        tbody.appendChild(tr);
      });
      table.appendChild(thead);
      table.appendChild(tbody);
      list.appendChild(table);
    } catch (e) {
      list.innerHTML = `<span class="error">Erro: ${e.message}</span>`;
    }
  }

  refresh();
  return card;
}

function input(placeholder, type = 'text') {
  const i = document.createElement('input');
  i.placeholder = placeholder; i.type = type; return i;
}
function field(labelText, inputEl) {
  const wrap = document.createElement('div');
  wrap.className = 'field';
  const label = document.createElement('label');
  label.className = 'label';
  label.textContent = labelText;
  wrap.append(label, inputEl);
  return new Proxy(inputEl, { get: (t, p) => (p === 'wrapper' ? wrap : t[p]) });
}
function button(text, onClick) {
  const b = document.createElement('button'); b.className = 'primary'; b.textContent = text; b.addEventListener('click', onClick); return b;
}


