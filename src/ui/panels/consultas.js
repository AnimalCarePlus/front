import { consultasApi } from '../../services/prontuarioApi.js';
import { agendamentoApi } from '../../services/agendamentoApi.js';

export function ConsultasPanel() {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = '<h2>Consultas</h2>';

  const form = document.createElement('div'); form.className = 'form-grid';
  const animalId = field('ID do animal', input('ID do animal'));
  const data = field('Data (YYYY-MM-DD)', input('Data (YYYY-MM-DD)'));
  const tipo = field('Tipo', input('Tipo'));
  const status = field('Status', input('Status'));
  const diagnostico = field('Diagnóstico', input('Diagnóstico'));
  const tratamento = field('Tratamento', input('Tratamento'));
  const cirurgia = field('Cirurgia', input('Cirurgia'));
  const peso = field('Peso', input('Peso', 'number'));
  const out = document.createElement('pre'); out.className = 'card';

  const actions = document.createElement('div'); actions.className = 'actions';
  const createBtn = button('Registrar no Prontuário', async () => {
    try {
      const res = await consultasApi.create(Number(animalId.value), { data: data.value, tipo: tipo.value, status: status.value, diagnostico: diagnostico.value, tratamento: tratamento.value, cirurgia: cirurgia.value, peso: Number(peso.value) });
      out.textContent = JSON.stringify(res, null, 2);
    } catch (e) { out.textContent = `Erro: ${e.message}`; }
  });

  const listBtn = button('Listar do Prontuário', async () => {
    try { out.textContent = JSON.stringify(await consultasApi.list(Number(animalId.value)), null, 2); }
    catch (e) { out.textContent = `Erro: ${e.message}`; }
  });

  const vetId = field('ID do veterinário', input('ID do veterinário'));
  const dateDisp = field('Data (YYYY-MM-DD)', input('Data (YYYY-MM-DD)'));
  const disponibilidadeBtn = button('Disponibilidade', async () => {
    try { out.textContent = JSON.stringify(await agendamentoApi.disponibilidade(Number(vetId.value), dateDisp.value), null, 2); }
    catch (e) { out.textContent = `Erro: ${e.message}`; }
  });

  actions.append(createBtn, listBtn);
  form.append(animalId.wrapper, data.wrapper, tipo.wrapper, status.wrapper, diagnostico.wrapper, tratamento.wrapper, cirurgia.wrapper, peso.wrapper, actions, document.createElement('hr'), vetId.wrapper, dateDisp.wrapper, disponibilidadeBtn);
  card.append(form, out);
  return card;
}

function input(placeholder, type = 'text') { const i = document.createElement('input'); i.placeholder = placeholder; i.type = type; return i; }
function field(labelText, inputEl) { const wrap = document.createElement('div'); wrap.className = 'field'; const label = document.createElement('label'); label.className = 'label'; label.textContent = labelText; wrap.append(label, inputEl); return new Proxy(inputEl, { get: (t, p) => (p === 'wrapper' ? wrap : t[p]) }); }
function button(text, onClick) { const b = document.createElement('button'); b.className = 'primary'; b.textContent = text; b.addEventListener('click', onClick); return b; }


