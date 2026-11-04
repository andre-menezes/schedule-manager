<template>
  <v-sheet
    class="code-block rounded-lg border-accent border-sm overflow-hidden"
    data-cy="code-block"
  >
    <v-toolbar
      v-if="language || filename"
      density="compact"
      color="accent-variant"
      class="pa-2"
      :height="36"
    >
      <span class="text-caption font-weight-medium text-medium-emphasis px-2">
        {{ filename || language }}
      </span>

      <v-spacer />

      <v-chip v-if="filename && language" size="x-small" variant="text" color="secondary-text">
        {{ language }}
      </v-chip>
    </v-toolbar>

    <v-sheet color="accent-variant" class="d-flex align-start ga-2 px-4 py-3">
      <pre
        class="code-block__pre text-high-emphasis flex-grow-1"
        tabindex="0"
      ><code>{{ code }}</code></pre>
      <v-btn
        icon
        size="small"
        variant="text"
        :aria-label="copyLabel"
        data-cy="code-block-copy"
        @click="copy"
      >
        <v-icon :icon="copied ? 'check' : 'content_copy'" />
        <v-tooltip
          activator="parent"
          location="top"
          color="surface"
          theme="dark"
          :aria-label="tooltipText"
        >
          {{ tooltipText }}
        </v-tooltip>
      </v-btn>
    </v-sheet>
  </v-sheet>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CodeBlockProps } from '../types';

const { code, language, filename } = defineProps<CodeBlockProps>();

const { t } = useI18n();
const copied = ref(false);
const copyLabel = t('common.copyCode');
// O Vuetify mantém o contêiner do tooltip no DOM mesmo fechado; o aria-label
// dá nome a ele para leitores de tela.
const tooltipText = computed(() => (copied.value ? t('common.copied') : copyLabel));

let resetTimer: ReturnType<typeof setTimeout> | undefined;

async function copy(): Promise<void> {
  try {
    await navigator.clipboard.writeText(code);
    copied.value = true;

    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    copied.value = false;
  }
}
</script>

<style scoped>
.code-block__pre {
  margin: 0;
  white-space: pre;
  overflow-x: auto;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
}
</style>
