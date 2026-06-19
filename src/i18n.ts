import i18next, { type BackendModule } from 'i18next';

import en from '../translations/en.json';

const NAMESPACE = 'translation';
const DEFAULT_LANGUAGE = 'en';
const STORAGE_KEY = 'lang';

// Add a language: drop translations/<code>.json and register the loader here.
const translationLoaders = {
  nl: () => import('../translations/nl.json')
} satisfies Record<string, () => Promise<{ default: typeof en }>>;

export const availableLanguages = [DEFAULT_LANGUAGE, ...Object.keys(translationLoaders)];

const lazyTranslationBackend: BackendModule = {
  type: 'backend',
  init() {},
  read(language, namespace, callback) {
    if (namespace !== NAMESPACE) {
      callback(null, {});
      return;
    }

    const code = language.split('-')[0];
    if (code === DEFAULT_LANGUAGE) {
      callback(null, en);
      return;
    }

    const load = translationLoaders[code as keyof typeof translationLoaders];
    if (!load) {
      callback(new Error(`Unsupported language: ${language}`), null);
      return;
    }

    load()
      .then((mod) => callback(null, mod.default))
      .catch((error: unknown) => callback(error instanceof Error ? error : String(error), null));
  }
};

/** Stored choice, else the browser language if supported, else default. */
function detectInitialLanguage(): string {
  const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
  if (stored && availableLanguages.includes(stored)) {
    return stored;
  }
  const browser = globalThis.navigator?.language?.split('-')[0];
  return browser && availableLanguages.includes(browser) ? browser : DEFAULT_LANGUAGE;
}

export async function setLanguage(language: string): Promise<void> {
  await i18next.changeLanguage(language);
  globalThis.localStorage?.setItem(STORAGE_KEY, language);
}

export async function initI18n() {
  await i18next.use(lazyTranslationBackend).init({
    lng: detectInitialLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    fallbackNS: NAMESPACE,
    defaultNS: NAMESPACE,
    ns: [NAMESPACE],
    nonExplicitSupportedLngs: true,
    partialBundledLanguages: true,
    supportedLngs: availableLanguages,
    interpolation: { escapeValue: false },
    resources: { [DEFAULT_LANGUAGE]: { [NAMESPACE]: en } }
  });
  return i18next;
}

export { i18next };
