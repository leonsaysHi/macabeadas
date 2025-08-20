import { createI18n } from 'vue-i18n';
import es from '@/i18n/es';
import en from '@/i18n/en';
const i18n = createI18n({
  locale: 'en',
  legacy: false,
  globalInjection: true,
  allowComposition: true,
  messages: {
    es,
    en,
  },
});

export default i18n;
