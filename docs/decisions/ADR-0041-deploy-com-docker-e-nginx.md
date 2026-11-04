# ADR-0041: Deploy em imagem Docker com Nginx

- **Status:** Aceita
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0022 (GitHub e CI), ADR-0024 (pnpm), ADR-0034 (actions
  fixadas por SHA), ADR-0039 (API simulada só no dev)

## Contexto e problema

O template gerava o `dist/`, mas não dizia como servi-lo. Uma SPA precisa de
fallback para o `index.html` (senão um F5 em `/customers/7` dá 404), de cache
certo (assets com hash cacheados, `index.html` não) e de cabeçalhos de
segurança. Cada projeto resolveria isso de um jeito. Onde e como os projetos
criados a partir do template devem rodar?

## Drivers da decisão

- Funcionar em servidor próprio e em qualquer nuvem, sem depender de um
  provedor.
- Uma configuração de servidor revisada, igual em todos os projetos.
- O CI provar que a imagem sobe.

## Opções consideradas

- **Imagem Docker com Nginx** — escolhida.
- **Vercel ou Netlify** — deploy simples e com previews, mas prende o projeto
  ao provedor e não serve para servidores próprios.
- **S3 + CloudFront** — barato e escalável, mas só na AWS e com o fallback e
  os cabeçalhos configurados fora do repositório.

## Decisão

- `Dockerfile` multi-stage: `node:24.22.2-alpine` com o pnpm do
  `packageManager` gera o build; `nginxinc/nginx-unprivileged:1.29-alpine`
  serve o `dist/` na porta 8080, sem root, com `HEALTHCHECK` em `/healthz`.
- `docker/nginx.conf.template`: fallback da SPA, cache de 1 ano para
  `/assets/*` e `no-cache` para o `index.html`, gzip, CSP e cabeçalhos de
  segurança. `CSP_CONNECT_SRC` (lida na partida, pelo envsubst da imagem)
  libera a API em outro domínio.
- As variáveis `VITE_*` entram por `--build-arg`: o Vite as embute no build.
- O CI ganha o job `docker`, que gera a imagem, sobe o contêiner e confere o
  health check, o fallback e a CSP. Publicar a imagem fica para cada projeto.
- Guia em `docs/DEPLOY.md`, com o proxy da API como exemplo opcional.

## Consequências

### Positivas

- Um projeto novo já nasce com servidor de produção pronto e testado no CI.
- Cache e cabeçalhos de segurança iguais em todos os projetos.

### Negativas / trade-offs

- Trocar uma `VITE_*` exige gerar a imagem de novo (uma imagem por ambiente).
- A CSP precisa ser ajustada a cada serviço externo novo (ex.: monitoramento).
- Mais um job no CI (cerca de 1 minuto).

### Neutras

- Quem preferir Vercel, Netlify ou S3 continua podendo publicar o `dist/`;
  o fallback e os cabeçalhos do template servem de referência.

## Referências

- `Dockerfile`, `.dockerignore`, `docker/nginx.conf.template`,
  `.github/workflows/ci.yml` (job `docker`), `docs/DEPLOY.md`.
- [nginx-unprivileged](https://github.com/nginx/docker-nginx-unprivileged)
