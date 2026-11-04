<template>
  <v-table
    density="comfortable"
    class="dependency-rules-table border rounded-lg"
    data-cy="dependency-rules"
  >
    <thead>
      <tr>
        <th class="text-left font-weight-bold">
          {{ $t('architecture.dependencyRules.columns.layer') }}
        </th>
        <th class="text-left font-weight-bold">
          {{ $t('architecture.dependencyRules.columns.canImport') }}
        </th>
        <th class="text-left font-weight-bold">
          {{ $t('architecture.dependencyRules.columns.cannotImport') }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="rule in rules" :key="rule.layer">
        <td>
          <v-chip size="small" variant="tonal" color="primary">{{ rule.layer }}</v-chip>
        </td>
        <td class="text-medium-emphasis">{{ rule.canImport }}</td>
        <td class="text-medium-emphasis">{{ rule.cannotImport }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import type { DependencyRule } from '../types';

defineProps<{
  rules: DependencyRule[];
}>();
</script>
