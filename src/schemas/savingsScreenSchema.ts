import * as yup from 'yup';

export const savingsScreenSchema = yup.object().shape({
  savingsValue: yup
    .number()
    .required('Savings value is required')
    .min(1, 'Savings value must be at least one digit')
    .test('not-starts-with-zero', 'Savings value cannot start with zero', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue[0] !== '0'; //first char is not zero check
    })
    .test('greater-than-zero', 'Savings value cannot be empty', (value) => {
      if (!value) {
        return false;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Savings value must be a number')
    .test('max-digits', 'Savings value must be max 8 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length <= 8;
    })
    .test('max-decimals', 'Savings value must have max 2 decimal places', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const decimalCount = (value.toString().split('.')[1] || []).length;
      return decimalCount <= 2;
    }),
  savingsTitle: yup
    .string()
    .required('Savings title is required')
    .min(2, 'Savings title must be at least 2 chars')
    .max(60, 'Savings title must be max 60 chars'),
  savingsNotes: yup.string().notRequired(),
  savingsDate: yup.string().required('Date is required'),
  savingsCategory: yup.string().test('is-category-selected', 'Category is required', (value) => {
    if (!value || Object.keys(value).length === 0) {
      return false;
    }
    return true;
  }),
  savingsAccount: yup.string().test('is-account-selected', 'Account is required', (value) => {
    if (!value || Object.keys(value).length === 0) {
      return false;
    }
    return true;
  }),
  savingsCurrency: yup.string().test('is-savings-selected', 'Currency is required', (value) => {
    if (!value || Object.keys(value).length === 0) {
      return false;
    }
    return true;
  }),
});
