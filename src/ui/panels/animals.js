import { animalsApi } from '../../services/prontuarioApi.js';

export function AnimalsPanel() {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = '<h2>Prontuário - Animais</h2>';

  const formCreate = document.createElement('div'); formCreate.className = 'form-grid';
  const nome = field('Nome do animal', input('Nome do animal'));
  const tutor_nome = field('Nome do tutor', input('Nome do tutor'));
  const tutor_contato = field('Contato do tutor', input('Contato do tutor'));
  const out = document.createElement('pre'); out.className = 'card';

  const actionsCreate = document.createElement('div'); actionsCreate.className = 'actions';
  const createBtn = button('Cadastrar', async () => {
    try { const res = await animalsApi.create({ nome: nome.value, tutor_nome: tutor_nome.value, tutor_contato: tutor_contato.value }); out.textContent = JSON.stringify(res, null, 2); }
    catch (e) { out.textContent = `Erro: ${e.message}`; }
  });
  actionsCreate.append(createBtn);

  const formOps = document.createElement('div'); formOps.className = 'form-grid';
  const animalId = field('ID do animal', input('ID do animal'));
  const actionsOps = document.createElement('div'); actionsOps.className = 'actions';
  const getBtn = button('Buscar', async () => { try { out.textContent = JSON.stringify(await animalsApi.get(animalId.value), null, 2); } catch (e) { out.textContent = `Erro: ${e.message}`; } });
  const existsBtn = button('Existe?', async () => { try { out.textContent = JSON.stringify(await animalsApi.exists(animalId.value), null, 2); } catch (e) { out.textContent = `Erro: ${e.message}`; } });
  const inactivateBtn = button('Inativar', async () => { try { out.textContent = JSON.stringify(await animalsApi.inactivate(animalId.value), null, 2); } catch (e) { out.textContent = `Erro: ${e.message}`; } });
  const deleteBtn = button('Excluir', async () => { try { out.textContent = JSON.stringify(await animalsApi.remove(animalId.value), null, 2); } catch (e) { out.textContent = `Erro: ${e.message}`; } });
  actionsOps.append(getBtn, existsBtn, inactivateBtn, deleteBtn);

  formCreate.append(nome.wrapper, tutor_nome.wrapper, tutor_contato.wrapper, actionsCreate);
  formOps.append(animalId.wrapper, actionsOps);
  card.append(formCreate, document.createElement('hr'), formOps, out);
  return card;
}

function input(placeholder, type = 'text') { const i = document.createElement('input'); i.placeholder = placeholder; i.type = type; return i; }
function field(labelText, inputEl) { const wrap = document.createElement('div'); wrap.className = 'field'; const label = document.createElement('label'); label.className = 'label'; label.textContent = labelText; wrap.append(label, inputEl); return new Proxy(inputEl, { get: (t, p) => (p === 'wrapper' ? wrap : t[p]) }); }
function button(text, onClick) { const b = document.createElement('button'); b.className = 'primary'; b.textContent = text; b.addEventListener('click', onClick); return b; }


