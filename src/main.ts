import { createApp } from 'vue';
import I18NextVue from 'i18next-vue';

import App from './App.vue';
import { router } from './router';
import { reveal } from './directives/reveal';
import { i18next, initI18n } from './i18n';
import './style.css';

void initI18n().then(() => {
  // Keep <html lang> in sync — WCAG 3.1.1/3.1.2.
  const setLang = () => {
    document.documentElement.lang = i18next.language.split('-')[0] ?? 'en';
  };
  setLang();
  i18next.on('languageChanged', setLang);

  createApp(App)
    .use(I18NextVue, { i18next })
    .directive('reveal', reveal)
    .use(router)
    .mount('#app');
});
