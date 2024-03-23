import * as yup from 'yup';

export const mainLanguageSchema = yup.object().shape({
  mainLanguage: yup
    .string()
    .test('is-main-language-selected', 'Main langauge is required', (value) => {
      if (!value || Object.keys(value).length === 0) {
        return false;
      }
      return true;
    }),
});
