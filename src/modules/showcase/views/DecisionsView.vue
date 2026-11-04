<template>
  <section class="decisions-page py-6 py-md-8" data-cy="decisions-page">
    <div class="mb-8">
      <p class="text-overline text-primary-text font-weight-bold mb-2">
        {{ $t('decisions.eyebrow') }}
      </p>
      <h1 class="text-h4 text-md-h3 font-weight-bold mb-2" data-cy="decisions-title">
        {{ $t('decisions.title') }}
      </h1>
      <p class="text-body-1 text-medium-emphasis mb-0" style="max-width: 760px">
        <i18n-t keypath="decisions.description" tag="span" scope="global">
          <template #path><code>docs/decisions/</code></template>
        </i18n-t>
      </p>
    </div>

    <DocSection
      :title="$t('decisions.madr.title')"
      :description="$t('decisions.madr.description')"
      icon="description"
      anchor="formato"
    >
      <v-row>
        <v-col v-for="part in madrParts" :key="part.title" cols="12" sm="6" md="3">
          <v-card variant="tonal" :color="part.color" class="h-100">
            <v-card-item>
              <template #prepend>
                <v-icon :icon="part.icon" />
              </template>
              <v-card-title class="text-subtitle-2 font-weight-bold">{{ part.title }}</v-card-title>
            </v-card-item>
            <v-card-text class="text-body-2">{{ part.description }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </DocSection>

    <DocSection
      :title="$t('decisions.status.title')"
      :description="$t('decisions.status.description')"
      icon="sync"
      anchor="status"
    >
      <div class="d-flex flex-wrap ga-4">
        <div v-for="info in statusLegend" :key="info.status" class="d-flex align-center ga-2">
          <v-chip :color="info.color" variant="tonal" size="small">{{ info.status }}</v-chip>
          <span class="text-body-2 text-medium-emphasis">{{ info.meaning }}</span>
        </div>
      </div>
    </DocSection>

    <DocSection
      :title="$t('decisions.index.title')"
      :description="$t('decisions.index.description')"
      icon="gavel"
      anchor="indice"
    >
      <v-table density="comfortable" class="border rounded-lg" data-cy="adr-table">
        <thead>
          <tr>
            <th class="text-left font-weight-bold">{{ $t('decisions.index.columnAdr') }}</th>
            <th class="text-left font-weight-bold">{{ $t('decisions.index.columnTitle') }}</th>
            <th class="text-left font-weight-bold">{{ $t('decisions.index.columnStatus') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="adr in adrs" :key="adr.id">
            <td>
              <v-chip size="small" variant="tonal" color="secondary">{{ adr.id }}</v-chip>
            </td>
            <td>{{ adr.title }}</td>
            <td>
              <v-chip size="small" variant="tonal" :color="statusColor(adr.status)">
                {{ adr.status }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
      <p class="text-caption text-medium-emphasis mt-3 mb-0">
        <i18n-t keypath="decisions.index.footer" tag="span" scope="global">
          <template #path><code>docs/decisions/</code></template>
          <template #example><code>ADR-0014-...</code></template>
        </i18n-t>
      </p>
    </DocSection>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import DocSection from '../components/DocSection.vue';
import type { AdrStatus, AdrStatusInfo } from '../types';
import { adrIndex } from '../adr-index';

const { t } = useI18n();

interface MadrPart {
  title: string;
  description: string;
  icon: string;
  color: string;
}

const madrParts = computed<MadrPart[]>(() => [
  {
    title: t('decisions.madr.context.title'),
    description: t('decisions.madr.context.description'),
    icon: 'help',
    color: 'accent',
  },
  {
    title: t('decisions.madr.options.title'),
    description: t('decisions.madr.options.description'),
    icon: 'list',
    color: 'info',
  },
  {
    title: t('decisions.madr.decision.title'),
    description: t('decisions.madr.decision.description'),
    icon: 'check_circle',
    color: 'primary',
  },
  {
    title: t('decisions.madr.consequences.title'),
    description: t('decisions.madr.consequences.description'),
    icon: 'balance',
    color: 'warning',
  },
]);

const statusLegend = computed<AdrStatusInfo[]>(() => [
  { status: 'Aceita', meaning: t('decisions.status.accepted'), color: 'success' },
  { status: 'Proposta', meaning: t('decisions.status.proposed'), color: 'info' },
  { status: 'Substituída', meaning: t('decisions.status.superseded'), color: 'warning' },
  { status: 'Descontinuada', meaning: t('decisions.status.deprecated'), color: 'error' },
]);

function statusColor(status: AdrStatus): string {
  return statusLegend.value.find((info) => info.status === status)?.color ?? 'secondary';
}

const adrs = adrIndex;
</script>
