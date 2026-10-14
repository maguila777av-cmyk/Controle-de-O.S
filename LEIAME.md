# Controle de O.S. — React (Vite) + backend Node, em um só serviço no Render

## Por que o front tinha sumido
O serviço do Render rodava só `backend/server.js`, que era apenas API (a raiz `/` devolvia `{"ok":true}`),
e o Render **não instala `devDependencies`** em produção, então o `vite build` nunca gerava a pasta `dist/`.
Agora o servidor entrega o `dist/` e o build instala o Vite explicitamente.

## Render (recomendado: serviço único)
No painel do serviço `controle-de-o-s` → Settings:
| Campo | Valor |
|---|---|
| Root Directory | *(vazio — raiz do repositório)* |
| Build Command | `npm run build:render` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |
| Environment | `GEMINI_API_KEY` (obrigatória), `NODE_VERSION=22` |
Depois: **Manual Deploy → Clear build cache & deploy**. Abra `https://SEU-SERVICO.onrender.com/`.
(Ou use o `render.yaml` como Blueprint.) `/api/health` mostra `"front": true` quando o dist foi encontrado.

## Alternativa: front no GitHub Pages
`npm run build` e publique `dist/`. No Pages o app já chama o Render sozinho; no Render mantenha
`FRONTEND_ORIGIN=https://SEU-USUARIO.github.io` (CORS). Para outro endereço de API: `VITE_API_BASE=https://...`.

## Desenvolvimento local
`npm install` · em um terminal `npm --prefix backend install && GEMINI_API_KEY=... node backend/server.js` ·
em outro `npm run dev` (o `/api` é encaminhado para `localhost:10000`; mude com `VITE_PROXY_TARGET`).

## Estrutura
- `src/App.jsx` + `src/components/*` — interface · `src/ia.js` — leitura/normalização da resposta da IA
- `src/api.js` — conexão com o backend (acorda o Render e tenta de novo) · `src/core.js` — usuários, PIN, dados locais
- `public/core.js` é **gerado** de `src/core.js` (script `scripts/sync-core.mjs`); `public/admin.html` é o painel antigo
- `backend/server.js` — API + serve `dist/` · `legado-python-fastapi/` — backend antigo, não usado
- `GEMINI_MODEL` (opcional, no Render) força o modelo da IA no servidor.

Observação: usuários, PIN e OS ficam no navegador de cada aparelho (localStorage); o PIN não é segurança de servidor.
