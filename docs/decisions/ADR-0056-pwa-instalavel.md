# ADR-0056: PWA instalável no MVP, sem app nativo

- **Status:** Proposta
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0041 (deploy com Docker e Nginx), ADR-0053

## Contexto e problema

As personas usam o Agenda sobretudo no celular (VISION, P1 e P2). Um app
nativo custa outro código-fonte e publicação nas lojas. O que oferecer no MVP
para a experiência de "app" no celular?

## Drivers da decisão

- Uso diário no celular com um toque.
- Um código só.
- Push no R2 (US-083).

## Opções consideradas

- **PWA instalável** (manifesto + service worker) — recomendada.
- **App nativo ou híbrido (Capacitor)**: lojas e push nativo, mas custo de
  publicação e manutenção antes de validar o produto.
- **Só site responsivo**: sem ícone na tela inicial, sem push.

## Decisão

Propomos um PWA no R1: manifesto, ícones e service worker para cache dos
arquivos estáticos e aviso de atualização (US-092), via `vite-plugin-pwa`
(dependência nova, entra com a aprovação desta ADR). O cache de dados
(agenda offline somente leitura, RNF-17) e o Web Push ficam para o R2. App
nativo é reavaliado depois do R2 (Q-12).

## Consequências

### Positivas

- Ícone na tela inicial e abertura em tela cheia sem lojas.

### Negativas / trade-offs

- No iOS, push só funciona com o PWA instalado (iOS 16.4+).
- O service worker exige cuidado com o cache do Nginx (`index.html` sem
  cache, ADR-0041).

### Neutras

- Lighthouse passa a ter a categoria PWA como verificação.

## Referências

- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
