<template>
  <section class="components-page py-6 py-md-8" data-cy="components-page">
    <div class="mb-8">
      <p class="text-overline text-primary-text font-weight-bold mb-2">
        {{ $t('components.eyebrow') }}
      </p>
      <h1 class="text-h4 text-md-h3 font-weight-bold mb-2" data-cy="components-title">
        {{ $t('components.title') }}
      </h1>
      <p class="text-body-1 text-medium-emphasis mb-0" style="max-width: 760px">
        {{ $t('components.description') }}
      </p>
    </div>

    <DocSection
      :title="$t('components.palette.title')"
      :description="$t('components.palette.description')"
      icon="palette"
      anchor="tema"
    >
      <v-row>
        <v-col v-for="color in themeColors" :key="color" cols="6" sm="4" md="2">
          <v-sheet :color="color" rounded="lg" height="88" class="pa-2">
            <v-row>
              <v-col cols="12">
                <span class="text-caption font-weight-medium">{{ color }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <span class="d-flex justify-end text-caption text-uppercase" style="opacity: 0.85">
                  {{ colorHex(color) }}
                </span>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
    </DocSection>

    <DocSection
      :title="$t('components.buttons.title')"
      :description="$t('components.buttons.description')"
      icon="smart_button"
      anchor="botoes"
    >
      <ShowcaseCard
        :title="$t('components.buttons.showcaseTitle')"
        :description="$t('components.buttons.showcaseDescription')"
        :code="buttonCode"
        language="vue"
      >
        <template #preview>
          <v-btn color="primary" variant="flat">{{ $t('components.buttons.primary') }}</v-btn>
          <v-btn color="primary" variant="tonal">{{ $t('components.buttons.tonal') }}</v-btn>
          <v-btn color="primary" variant="outlined">{{ $t('components.buttons.outlined') }}</v-btn>
          <v-btn color="primary" variant="text">{{ $t('components.buttons.text') }}</v-btn>
          <v-btn
            color="primary"
            icon="favorite"
            :aria-label="$t('components.buttons.favoriteAria')"
          />
        </template>
      </ShowcaseCard>
    </DocSection>

    <DocSection
      :title="$t('components.chips.title')"
      :description="$t('components.chips.description')"
      icon="sell"
      anchor="chips"
    >
      <ShowcaseCard
        :title="$t('components.chips.showcaseTitle')"
        :description="$t('components.chips.showcaseDescription')"
        :code="chipCode"
        language="vue"
      >
        <template #preview>
          <v-chip color="success" variant="tonal" prepend-icon="check_circle">
            {{ $t('components.chips.approved') }}
          </v-chip>
          <v-chip color="warning" variant="tonal" prepend-icon="schedule">
            {{ $t('components.chips.pending') }}
          </v-chip>
          <v-chip color="error" variant="tonal" prepend-icon="cancel">
            {{ $t('components.chips.blocked') }}
          </v-chip>
          <v-chip color="info-text" variant="outlined">v4.0.0</v-chip>
        </template>
      </ShowcaseCard>
    </DocSection>

    <DocSection
      :title="$t('components.alerts.title')"
      :description="$t('components.alerts.description')"
      icon="notifications_active"
      anchor="alertas"
    >
      <ShowcaseCard
        :title="$t('components.alerts.showcaseTitle')"
        :description="$t('components.alerts.showcaseDescription')"
        :code="alertCode"
        language="vue"
      >
        <template #preview>
          <div class="d-flex flex-column ga-3 flex-grow-1">
            <v-alert type="success" variant="tonal" :text="$t('components.alerts.success')" />
            <v-alert type="warning" variant="tonal" :text="$t('components.alerts.warning')" />
            <v-alert type="error" variant="tonal" :text="$t('components.alerts.error')" />
          </div>
        </template>
      </ShowcaseCard>
    </DocSection>

    <DocSection
      :title="$t('components.apiError.title')"
      :description="$t('components.apiError.description')"
      icon="report"
      anchor="erro-api"
    >
      <p class="text-body-2 text-medium-emphasis mb-4">
        {{ $t('components.apiError.intro') }}
        <a
          href="https://www.rfc-editor.org/rfc/rfc9457"
          target="_blank"
          rel="noopener"
          class="text-primary-text"
        >
          RFC 9457
        </a>
      </p>
      <ShowcaseCard
        :title="$t('components.apiError.showcaseTitle')"
        :description="$t('components.apiError.showcaseDescription')"
        :code="apiErrorCode"
        language="ts"
      >
        <template #preview>
          <div class="d-flex flex-column ga-3 flex-grow-1">
            <v-alert
              closable
              type="error"
              variant="tonal"
              icon="cancel"
              :title="problem.title"
              :text="apiErrorMessage"
            />
            <CodeBlock :code="problemJson" language="json" filename="problem+json" />
          </div>
        </template>
      </ShowcaseCard>
    </DocSection>

    <DocSection
      :title="$t('components.cards.title')"
      :description="$t('components.cards.description')"
      icon="dashboard"
      anchor="cartoes"
    >
      <ShowcaseCard
        :title="$t('components.cards.showcaseTitle')"
        :description="$t('components.cards.showcaseDescription')"
        :code="cardCode"
        language="vue"
      >
        <template #preview>
          <v-card variant="tonal" color="primary" width="280">
            <v-card-item>
              <template #prepend>
                <v-avatar color="primary" variant="flat" size="40">
                  <v-icon icon="widgets" />
                </v-avatar>
              </template>
              <v-card-title class="text-subtitle-1 font-weight-bold">
                {{ $t('components.cards.previewTitle') }}
              </v-card-title>
            </v-card-item>
            <v-card-text>{{ $t('components.cards.previewText') }}</v-card-text>
            <v-card-actions>
              <v-btn color="primary" variant="text" append-icon="arrow_forward">
                {{ $t('components.cards.previewAction') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </ShowcaseCard>
    </DocSection>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import DocSection from '../components/DocSection.vue';
import ShowcaseCard from '../components/ShowcaseCard.vue';
import CodeBlock from '../components/CodeBlock.vue';
import { useErrorMessage } from '@shared/composables';
import type { ProblemDetails } from '@typings/http';

const theme = useTheme();

/** Retorna o hexadecimal da cor no tema ativo (adapta-se a light/dark). */
function colorHex(color: string): string {
  const value = theme.current.value.colors[color];
  return typeof value === 'string' ? value : '';
}

// Exemplo de corpo de erro no padrão RFC 9457 retornado por uma API.
const problem: ProblemDetails = {
  type: 'https://api.exemplo.gov.br/erros/saldo-insuficiente',
  title: 'Saldo insuficiente',
  status: 422,
  detail: 'A conta não possui saldo para concluir a transferência.',
  instance: '/contas/123/transferencias',
};

// A mensagem exibida no alerta é derivada pelo mesmo helper usado em produção.
const errorMessage = useErrorMessage();
const apiErrorMessage = computed(() => errorMessage({ status: problem.status, data: problem }));

const problemJson = JSON.stringify(problem, null, 2);

const apiErrorCode = `import { useI18n } from 'vue-i18n';
import { useErrorMessage } from '@shared/composables';
import { transferRequest } from '../api/account.service';

const { t } = useI18n();
const errorMessage = useErrorMessage();

async function transfer(): Promise<void> {
  try {
    await transferRequest(params);
  } catch (error) {
    // Extrai detail/title do corpo application/problem+json (RFC 9457);
    // sem eles, usa o texto traduzido informado (ou os padrões errors.*).
    alertMessage.value = errorMessage(error, { unexpected: t('transfer.failed') });
  }
}`;

const themeColors = [
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
  'surface',
];

const buttonCode = `<v-btn color="primary" variant="flat">Primário</v-btn>
<v-btn color="primary" variant="tonal">Tonal</v-btn>
<v-btn color="primary" variant="outlined">Outline</v-btn>
<v-btn color="primary" variant="text">Texto</v-btn>
<v-btn color="primary" icon="favorite" aria-label="Favoritar" />`;

const chipCode = `<v-chip color="success" variant="tonal" prepend-icon="check_circle">Aprovado</v-chip>
<v-chip color="warning" variant="tonal" prepend-icon="schedule">Pendente</v-chip>
<v-chip color="error" variant="tonal" prepend-icon="cancel">Bloqueado</v-chip>
<v-chip color="info-text" variant="outlined">v4.0.0</v-chip>`;

const alertCode = `<v-alert type="success" variant="tonal" text="Feature publicada com sucesso." />
<v-alert type="warning" variant="tonal" text="Há mudanças não commitadas." />
<v-alert type="error" variant="tonal" text="Falha ao carregar os dados." />`;

const cardCode = `<v-card variant="tonal" color="primary">
  <v-card-item>
    <template #prepend>
      <v-avatar color="primary" variant="flat" size="40">
        <v-icon icon="widgets" />
      </v-avatar>
    </template>
    <v-card-title>Módulo</v-card-title>
  </v-card-item>
  <v-card-text>Feature isolada por domínio.</v-card-text>
  <v-card-actions>
    <v-btn color="primary" variant="text" append-icon="arrow_forward">Abrir</v-btn>
  </v-card-actions>
</v-card>`;
</script>
