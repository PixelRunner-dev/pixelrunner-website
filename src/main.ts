import { createApp } from 'vue';
import I18NextVue from 'i18next-vue';

import App from './App.vue';
import { router } from './router';
import { reveal } from './directives/reveal';
import { i18next, initI18n } from './i18n';
import './style.css';

void initI18n().then(() => {
  const setMetaAttr = (selector: string, value: string) => {
    document.querySelector(selector)?.setAttribute('content', value);
  };
  // Keep <html lang>, document title and meta tags in sync with current language.
  const sync = () => {
    document.documentElement.lang = i18next.language.split('-')[0] ?? 'en';
    document.title = i18next.t('meta.title');
    setMetaAttr('meta[name="description"]', i18next.t('meta.description'));
    setMetaAttr('meta[property="og:title"]', i18next.t('meta.ogTitle'));
    setMetaAttr('meta[property="og:description"]', i18next.t('meta.ogDescription'));
  };
  sync();
  i18next.on('languageChanged', sync);

  createApp(App)
    .use(I18NextVue, { i18next })
    .directive('reveal', reveal)
    .use(router)
    .mount('#app');
});
