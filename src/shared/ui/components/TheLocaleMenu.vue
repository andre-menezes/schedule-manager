<template>
  <v-menu location="bottom end">
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        variant="text"
        icon="translate"
        :aria-label="$t('header.changeLanguage')"
        data-cy="locale-menu-btn"
      />
    </template>

    <v-list
      role="menu"
      density="compact"
      :aria-label="$t('header.languages')"
      data-cy="locale-menu"
    >
      <v-list-item
        v-for="option in options"
        :key="option.code"
        role="menuitemradio"
        :aria-checked="option.code === locale"
        :active="option.code === locale"
        :lang="option.code"
        :title="option.name"
        :data-cy="`locale-option-${option.code}`"
        @click="emit('changeLocale', option.code)"
      >
        <template #append>
          <v-icon v-if="option.code === locale" icon="check" size="small" />
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { LOCALE_NATIVE_NAMES, SUPPORTED_LOCALES, type SupportedLocale } from '@core/config';

defineProps<{
  locale: SupportedLocale;
}>();

const emit = defineEmits<{
  changeLocale: [locale: SupportedLocale];
}>();

// Cada idioma aparece com o nome nativo e com o `lang` dele, para o leitor de
// tela pronunciá-lo no idioma certo (WCAG 3.1.2).
const options = SUPPORTED_LOCALES.map((code) => ({ code, name: LOCALE_NATIVE_NAMES[code] }));
</script>
