<template>
  <section class="home-page py-6 py-md-8" data-cy="docs-home-page">
    <div class="mb-8">
      <p class="text-overline text-primary-text font-weight-bold mb-2">
        {{ $t('docsHome.eyebrow') }}
      </p>
      <h1 class="text-h4 text-md-h3 font-weight-bold mb-2" data-cy="docs-home-title">
        {{ $t('docsHome.title') }}
      </h1>
      <p class="text-body-1 text-medium-emphasis mb-0" style="max-width: 720px">
        {{ $t('docsHome.description') }}
      </p>
    </div>

    <v-row class="mb-2">
      <v-col v-for="metric in metrics" :key="metric.label" cols="12" sm="6" xl="3">
        <MetricCard :metric="metric" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="8">
        <div class="mb-4">
          <p class="text-overline text-primary-text font-weight-bold mb-1">
            {{ $t('docsHome.navEyebrow') }}
          </p>
          <h2 class="text-h6 font-weight-bold mb-0">{{ $t('docsHome.navTitle') }}</h2>
        </div>
        <v-row>
          <v-col v-for="card in navCards" :key="card.route" cols="12" sm="6">
            <NavigationCard :card="card" />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" lg="4" class="mt-16">
        <WorkFlow :activity="activity" />
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import MetricCard from '../components/MetricCard.vue';
import NavigationCard from '../components/NavigationCard.vue';
import WorkFlow from '../components/WorkFlow.vue';
import type { Activity, Metric, NavCard } from '../types';

const { t } = useI18n();

const { runtimeDependencies, toolingDependencies } = __APP_META__;
const totalDependencies = runtimeDependencies + toolingDependencies;

const metrics = computed<Metric[]>(() => [
  {
    label: t('docsHome.metrics.totalDeps.label'),
    value: totalDependencies,
    detail: t('docsHome.metrics.totalDeps.detail'),
    icon: 'deployed_code',
    color: 'primary',
  },
  {
    label: t('docsHome.metrics.runtime.label'),
    value: runtimeDependencies,
    detail: t('docsHome.metrics.runtime.detail'),
    icon: 'rocket_launch-fill',
    color: 'accent',
  },
  {
    label: t('docsHome.metrics.tooling.label'),
    value: toolingDependencies,
    detail: t('docsHome.metrics.tooling.detail'),
    icon: 'build',
    color: 'info',
  },
  {
    label: t('docsHome.metrics.quality.label'),
    value: 'CI',
    detail: t('docsHome.metrics.quality.detail'),
    icon: 'verified_user',
    color: 'warning',
  },
]);

const navCards = computed<NavCard[]>(() => [
  {
    title: t('docsHome.cards.architecture.title'),
    description: t('docsHome.cards.architecture.description'),
    icon: 'account_tree',
    color: 'primary',
    route: '/arquitetura',
  },
  {
    title: t('docsHome.cards.onboarding.title'),
    description: t('docsHome.cards.onboarding.description'),
    icon: 'rocket_launch-fill',
    color: 'accent',
    route: '/onboarding',
  },
  {
    title: t('docsHome.cards.components.title'),
    description: t('docsHome.cards.components.description'),
    icon: 'palette',
    color: 'info',
    route: '/componentes',
  },
  {
    title: t('docsHome.cards.conventions.title'),
    description: t('docsHome.cards.conventions.description'),
    icon: 'checklist',
    color: 'success',
    route: '/convencoes',
  },
  {
    title: t('docsHome.cards.decisions.title'),
    description: t('docsHome.cards.decisions.description'),
    icon: 'gavel',
    color: 'secondary',
    route: '/decisoes',
  },
]);

const activity = computed<Activity[]>(() => [
  {
    title: t('docsHome.workflow.install'),
    detail: 'pnpm install',
    icon: 'deployed_code',
    color: 'success',
  },
  {
    title: t('docsHome.workflow.dev'),
    detail: 'pnpm dev',
    icon: 'dns',
    color: 'secondary',
  },
  {
    title: t('docsHome.workflow.lint'),
    detail: 'pnpm lint',
    icon: 'code',
    color: 'primary',
  },
  {
    title: t('docsHome.workflow.unitTests'),
    detail: 'pnpm test',
    icon: 'science',
    color: 'warning',
  },
  {
    title: t('docsHome.workflow.e2eTests'),
    detail: 'pnpm test:e2e',
    icon: 'travel_explore',
    color: 'info',
  },
  {
    title: t('docsHome.workflow.build'),
    detail: 'pnpm build',
    icon: 'deployed_code_update',
    color: 'accent',
  },
]);
</script>
