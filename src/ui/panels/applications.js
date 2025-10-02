import { applicationsApi } from '../../services/vaccinesApi.js';

export function ApplicationsPanel() {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = '<h2>Aplicações de Vacina</h2>';

  const form = document.createElement('div'); form.className = 'form-grid';
  const animalId = field('ID Animal', input('ID Animal'));
  const vaccineId = field('ID Vacina', input('ID Vacina'));
  const batchNumber = field('Lote', input('Lote'));
  const appliedBy = field('Aplicada por', input('Aplicada por'));
  const dose = field('Dose', input('Dose'));
  const notes = field('Observações', input('Observações'));
  const out = document.createElement('pre');
  out.className = 'card';
  const actions = document.createElement('div'); actions.className = 'actions';
  const applyBtn = button('Aplicar', async () => {
    try {
      const res = await applicationsApi.apply({ animalId: animalId.value, vaccineId: vaccineId.value, batchNumber: batchNumber.value, appliedBy: appliedBy.value, dose: dose.value, notes: notes.value });
      out.textContent = JSON.stringify(res, null, 2);
    } catch (e) {
      out.textContent = `Erro: ${e.message}`;
    }
  });
  actions.append(applyBtn);
  form.append(animalId.wrapper, vaccineId.wrapper, batchNumber.wrapper, appliedBy.wrapper, dose.wrapper, notes.wrapper, actions);
  card.append(form, out);
  return card;
}

function input(placeholder, type = 'text') { const i = document.createElement('input'); i.placeholder = placeholder; i.type = type; return i; }
function field(labelText, inputEl) { const wrap = document.createElement('div'); wrap.className = 'field'; const label = document.createElement('label'); label.className = 'label'; label.textContent = labelText; wrap.append(label, inputEl); return new Proxy(inputEl, { get: (t, p) => (p === 'wrapper' ? wrap : t[p]) }); }
function button(text, onClick) { const b = document.createElement('button'); b.className = 'primary'; b.textContent = text; b.addEventListener('click', onClick); return b; }


