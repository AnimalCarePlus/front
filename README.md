# Front-end (ES Modules) - Clínica Vet

Este front-end é um app estático (HTML + JS módulos) que consome os três microsserviços via REST.

## Estrutura
- `index.html`: ponto de entrada
- `styles.css`: estilos básicos
- `src/main.js`: bootstrap do app e configuração de URLs das APIs
- `src/services/*`: clientes HTTP dos microsserviços
- `src/ui/*`: componentes de UI (abas/painéis)

## Configuração de APIs
Por padrão (em `src/main.js`):
- Vacinas: `http://localhost:3001/api`
- Prontuário: `http://localhost:5000/api`
- Agendamento: `http://localhost:9091/api`

Ajuste conforme necessário editando `src/main.js`.

## Autenticação
- Cole o token JWT no campo do topo da página. Ele será enviado em `Authorization: Bearer <token>`.
- Tokens de exemplo:
  - Vacinas (Node): executar `node generateToken.js` em `ms-controle-vacinas`.
  - Prontuário (Python): executar `python generate_token.py` em `ms-prontuario-animal`.
  - Agendamento (Java): depende da configuração de validação do token; ajuste conforme seu serviço de auth.

## Executando
Como é estático, basta abrir `index.html` no navegador (duplo clique). Caso seu navegador bloqueie requisições por CORS/HTTPS misto, sirva estático com um servidor simples:

- Python 3:
```bash
cd front
python -m http.server 8080
```
Abra `http://localhost:8080`.

- Node (http-server):
```bash
npm i -g http-server
cd front
http-server -p 8080
```

## Observações
- O microsserviço de Vacinas já habilita CORS. Se o Prontuário/Agendamento bloquear CORS, habilite CORS no backend.
- A operação de cancelamento de consulta via DELETE com corpo não foi implementada no front porque navegadores não enviam corpo em DELETE de forma consistente. Use atualizar/consultar e disponibilidade.


