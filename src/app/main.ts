import { createApp } from 'vue';
import { registerPlugins } from '@app/providers/plugins';
import { registerErrorHandlers } from '@app/providers/errors';
import { createErrorReporter } from '@app/providers/monitoring';
import App from './App.vue';

const app = createApp(App);

// Com VITE_SENTRY_DSN, os erros vão também para o Sentry (ADR-0043).
registerErrorHandlers(app, await createErrorReporter(app));
registerPlugins(app);

app.mount('#app');
