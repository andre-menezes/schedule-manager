# Imagem de produção da SPA (ADR-0041): build com Node + pnpm e servida pelo
# Nginx. As variáveis VITE_* entram no build (o Vite as embute no bundle);
# passe-as com --build-arg. A CSP e o upstream da API são lidos na partida.
#
#   docker build -t meu-app --build-arg VITE_API_BASE_URL=/api .
#   docker run -p 8080:8080 meu-app

# ── build ────────────────────────────────────────────────────────────────
FROM node:24.22.2-alpine AS build
WORKDIR /app

# A versão do pnpm vem do `packageManager` do package.json.
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

ARG VITE_APP_NAME
ARG VITE_APP_DEFAULT_LOCALE
ARG VITE_API_BASE_URL
ARG VITE_SENTRY_DSN
ENV VITE_APP_NAME=$VITE_APP_NAME \
    VITE_APP_DEFAULT_LOCALE=$VITE_APP_DEFAULT_LOCALE \
    VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_SENTRY_DSN=$VITE_SENTRY_DSN

RUN pnpm build

# ── runtime ──────────────────────────────────────────────────────────────
# Variante oficial sem root do Nginx: escuta na 8080 e roda como `nginx`.
FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime

# Origens extras liberadas na CSP para chamadas HTTP (ex.: a API em outro
# domínio). Vazio = só a própria origem.
ENV CSP_CONNECT_SRC=""

# A imagem aplica o envsubst em /etc/nginx/templates/*.template na partida e
# grava o resultado em /etc/nginx/conf.d/.
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
