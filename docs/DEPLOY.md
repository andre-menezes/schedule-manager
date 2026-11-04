# Deploy com Docker + Nginx

A aplicação é uma SPA estática: o build gera `dist/`, e um Nginx serve os
arquivos com fallback para o `index.html`. A imagem de produção faz as duas
coisas (ADR-0041).

Voltar para o índice: [README.md](README.md)

---

## Gerar e rodar a imagem

```bash
docker build -t meu-app .
docker run --rm -p 8080:8080 meu-app
```

Abra `http://localhost:8080`. A imagem tem duas etapas:

| Etapa     | Base                                      | O que faz                                          |
| --------- | ----------------------------------------- | -------------------------------------------------- |
| `build`   | `node:24.22.2-alpine` + pnpm (corepack)   | `pnpm install --frozen-lockfile` e `pnpm build`    |
| `runtime` | `nginxinc/nginx-unprivileged:1.29-alpine` | Serve o `dist/` na porta 8080, sem rodar como root |

## Configuração

As variáveis `VITE_*` são lidas **no build**: o Vite as embute no bundle.
Mudar uma delas exige gerar a imagem de novo.

```bash
docker build -t meu-app \
  --build-arg VITE_APP_NAME="Meu Sistema" \
  --build-arg VITE_API_BASE_URL=https://api.meu-sistema.com.br \
  .
```

| Variável                  | Quando                | Efeito                                                         |
| ------------------------- | --------------------- | -------------------------------------------------------------- |
| `VITE_APP_NAME`           | build (`--build-arg`) | Nome no cabeçalho e no título da aba                           |
| `VITE_API_BASE_URL`       | build (`--build-arg`) | URL da API; padrão `/api`                                      |
| `VITE_APP_DEFAULT_LOCALE` | build (`--build-arg`) | Idioma inicial (`pt-BR` ou `en-US`)                            |
| `VITE_SENTRY_DSN`         | build (`--build-arg`) | Liga o envio de erros ao Sentry (ADR-0043)                     |
| `CSP_CONNECT_SRC`         | partida (`-e`)        | Origens extras para chamadas HTTP na CSP, separadas por espaço |

A API simulada (`mock/`, ADR-0039) só existe no `pnpm dev`: na imagem, as
chamadas vão para a `VITE_API_BASE_URL` de verdade.

## O que o Nginx faz

Configuração em [`docker/nginx.conf.template`](../docker/nginx.conf.template):

- **Fallback da SPA:** qualquer caminho sem arquivo devolve o `index.html`, e
  o Vue Router resolve a rota (inclusive a 404 da aplicação).
- **Cache:** `/assets/*` (nomes com hash) com cache de 1 ano e `immutable`;
  o `index.html` com `no-cache`, para cada deploy chegar na hora.
- **Compressão:** gzip em CSS, JS, JSON e SVG.
- **Saúde:** `GET /healthz` responde `ok`, usado pelo `HEALTHCHECK` da imagem
  e por orquestradores.
- **Cabeçalhos de segurança:** `Content-Security-Policy`,
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` e
  `Permissions-Policy`.

### CSP

A política padrão só libera a própria origem:

```text
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; font-src 'self' data:; connect-src 'self' <CSP_CONNECT_SRC>;
frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

- `style-src 'unsafe-inline'`: o Vuetify aplica estilos inline (tema).
- API em outro domínio: passe a origem na partida, senão o navegador bloqueia
  as chamadas: `docker run -e CSP_CONNECT_SRC="https://api.meu-sistema.com.br" …`.
- Sentry ligado: o navegador envia os erros ao host de ingestão, que entra na
  `CSP_CONNECT_SRC` (ex.: `https://o123456.ingest.sentry.io`; o host está no
  DSN, depois do `@`).
- Um serviço externo novo (monitoramento, analytics, imagens de CDN) também
  precisa entrar na diretiva certa do template.

## API no mesmo domínio (proxy)

Com `VITE_API_BASE_URL=/api` (o padrão), a API precisa responder em
`/api` no mesmo domínio. Quem faz isso costuma ser o balanceador ou o
ingress na frente do contêiner. Para o próprio Nginx fazer o proxy, acrescente
ao `docker/nginx.conf.template`, antes do `location /`:

```nginx
location /api/ {
  proxy_pass http://api:8080/;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

(`api:8080` é o endereço do backend na rede dos contêineres; a barra final
do `proxy_pass` tira o prefixo `/api` do caminho.)

## No CI

O job `docker` do CI gera a imagem, sobe o contêiner e confere o
`/healthz`, o fallback da SPA e a CSP. Ele não publica a imagem: o registry
(GitHub Container Registry, Docker Hub ou o da nuvem) e o deploy dependem de
onde cada projeto roda.
