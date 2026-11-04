<template>
  <!-- Primeiro elemento focável da página: leva direto ao conteúdo (ADR-0036). -->
  <a :href="`#${MAIN_CONTENT_ID}`" class="skip-link" data-cy="skip-link" @click="skipToContent">
    {{ $t('a11y.skipToContent') }}
  </a>
  <TheAppHeader @toggle-navigation="navigationOpen = !navigationOpen" />
  <TheNavigationMenu v-model="navigationOpen" />
  <v-main :id="MAIN_CONTENT_ID" tabindex="-1" class="main-content">
    <v-container max-width="1440" class="pb-10"><slot></slot></v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
import { MAIN_CONTENT_ID } from '@core/config';
import TheAppHeader from '../components/TheAppHeader.vue';
import TheNavigationMenu from '../components/TheNavigationMenu.vue';

const { mdAndUp } = useDisplay();

// Aberto no desktop; no mobile o drawer é temporário (overlay) e começa
// fechado, sendo aberto pelo botão de menu do header.
const navigationOpen = ref(mdAndUp.value);

/**
 * Foca o `<main>` em vez de deixar o navegador seguir o `#hash`: o hash
 * passaria pelo router (popstate) e nem todo navegador move o foco ao alvo.
 */
function skipToContent(event: MouseEvent): void {
  const main = document.getElementById(MAIN_CONTENT_ID);
  if (!main) {
    return;
  }
  event.preventDefault();
  main.focus();
}
</script>

<style scoped>
/* Fora da tela até receber foco; então aparece sobre o header. */
.skip-link {
  position: fixed;
  top: 8px;
  left: 8px;
  z-index: 3000;
  padding: 8px 16px;
  border-radius: 4px;
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  font-weight: 600;
  text-decoration: underline;
  transform: translateY(-200%);
}

.skip-link:focus {
  transform: none;
  outline: 2px solid rgb(var(--v-theme-on-surface));
  outline-offset: 2px;
}

/* O <main> recebe foco só por script (tabindex -1); sem contorno no bloco todo. */
.main-content:focus {
  outline: none;
}
</style>
