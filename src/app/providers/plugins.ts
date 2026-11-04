import type { App } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import pinia from './pinia';
import i18n from './i18n';
import vuetify from './vuetify';
import router from './router';
import { queryPluginOptions } from './query';

export function registerPlugins(app: App) {
  app.use(pinia);
  app.use(VueQueryPlugin, queryPluginOptions);
  app.use(i18n);
  app.use(router);
  app.use(vuetify);
}
