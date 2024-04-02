import * as yup from 'yup';

export const incomeScreenSchema = yup.object().shape({
  incomeValue: yup
    .number()
    .required('Income value is required')
    .min(1, 'Income value must be at least one digit')
    .test('not-starts-with-zero', 'Income value cannot start with zero', (value) => {
      if (!value) {
        return false;
      }
      const stringValue = value.toString(); // number to string
      return stringValue[0] !== '0'; //first char is not zero check
    })
    .test('greater-than-zero', 'Income value cannot be empty', (value) => {
      if (!value) {
        return false;
      }
      const stringValue = value.toString(); //  number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Income value must be a number')
    .test('max-digits', 'Income value must be max 8 digits', (value) => {
      if (!value) {
        return false;
      }
      const stringValue = value.toString(); //  number to string
      return stringValue.length <= 8;
    })
    .test('max-decimals', 'Income value must have max 2 decimal places', (value) => {
      if (!value) {
        return false;
      }
      const decimalCount = (value.toString().split('.')[1] || []).length;
      return decimalCount <= 2;
    }),
  incomeTitle: yup
    .string()
    .required('Income title is required')
    .min(2, 'Income title must be at least 2 chars')
    .max(60, 'Income title must be max 60 chars'),
  incomeNotes: yup.string().notRequired(),
  incomeDate: yup.string().required('Date is required'),
  incomeCategory: yup.string().test('is-category-selected', 'Category is required', (value) => {
    if (!value || Object.keys(value).length === 0) {
      return false;
    }
    return true;
  }),
  incomeAccount: yup.string().test('is-account-selected', 'Account is required', (value) => {
    if (!value || Object.keys(value).length === 0) {
      return false;
    }
    return true;
  }),
  incomeCurrency: yup.string().test('is-income-selected', 'Currency is required', (value) => {
    if (!value || Object.keys(value).length === 0) {
      return false;
    }
    return true;
  }),
});
