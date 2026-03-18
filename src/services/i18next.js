import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../localization/en.json';
import pl from '../localization/pl.json';
import de from '../localization/de.json';

export const languageResources = {
  en: {translation: en},
  pl: {translation: pl},
  de: {translation: de},
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: languageResources,
});

export default i18next;
