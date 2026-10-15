# Controle de O.S. · Açoforja (versão 3, React + Vite)

Front end reescrito do zero a partir dos dois backups. Um único aplicativo com duas áreas:

- **Aplicativo** (`#/`): Nova O.S. (foto → Gemini, com OCR local de reserva), Pesquisa, Histórico, Painel, Assistente e Conta.
- **Administração** (`#/admin`): Painel com filtros, Ordens (editar, excluir, exportar), Usuários, Cargos e permissões, Manuais (planilhas) e Configurações (teste do servidor, backup).

Os antigos `index.html` e `admin.html` não existem mais: tudo está em React.

## Rodar

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:5173
npm run build      # gera a pasta dist/ (publicável em qualquer hospedagem estática)
npm run preview    # testa o build
```

Para usar outro backend, crie `.env` com `VITE_API_BASE=https://SEU-SERVICO.onrender.com`.

## Publicar

- **GitHub Pages**: envie para a branch `main`; `.github/workflows/deploy.yml` faz o build e publica. Em Settings → Pages escolha "GitHub Actions".
- **Netlify / Cloudflare Pages**: comando `npm run build`, pasta `dist`. `public/_headers` traz os cabeçalhos de segurança.
- As rotas usam `#`, então não é preciso configurar redirecionamentos.

## Backend (`backend/`)

Node + Express; repassa as chamadas de IA ao Gemini sem expor a chave.

```bash
cd backend && npm install && node server.js
```

No Render defina `GEMINI_API_KEY` (chave do Google AI Studio, só no servidor) e `FRONTEND_ORIGIN` (endereços do front, separados por vírgula; ex.: `https://philippin999xz-ai.github.io`).

`backend/legacy-fastapi/` guarda o `main.py` antigo (FastAPI com chave de acesso e planilha mestra). O front atual não usa esse backend.

## Dados e compatibilidade

As chaves de armazenamento são as mesmas das versões anteriores (`os_regs`, `os_users`, `os_cargos`, fotos em `os_fotos`, manuais em `os_manuais`). Abrindo o app novo **no mesmo endereço** de antes, as O.S., usuários, PINs e fotos continuam lá. Em outro endereço: Administração → Config. → Baixar backup, e importe no novo.

## Estrutura

```
src/
  lib/         regras e dados (core.js, api.js, ia.js, stats.js, exportar.js, ocrLocal.js…)
  components/  Shell, Analitico, Charts, OSCard, UI (avisos e diálogos), Server…
  pages/       telas do aplicativo; pages/admin/ telas do painel
  styles.css   tokens (cores, fontes) e estilos
```

## Observações

- A biblioteca `xlsx` (0.18.5, a última no npm) só é baixada ao exportar ou importar planilhas. Importe apenas planilhas de fontes confiáveis.
- Usuários e PINs ficam no navegador do aparelho: o PIN barra uso casual, não é segurança de servidor.
