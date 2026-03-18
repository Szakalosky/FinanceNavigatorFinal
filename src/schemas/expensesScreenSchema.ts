import * as yup from 'yup';

export const expensesScreenSchema = yup.object().shape({
  expenseValue: yup
    .number()
    .required('Expense value is required')
    .min(1, 'Expense value must be at least one digit')
    .test('not-starts-with-zero', 'Expense value cannot start with zero', (value) => {
      if (!value) {
        return false;
      }
      const stringValue = value.toString(); // number to string
      return stringValue[0] !== '0'; //first char is not zero check
    })
    .test('greater-than-zero', 'Expense value cannot be empty', (value) => {
      if (!value) {
        return false;
      }
      const stringValue = value.toString(); // number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Expense value must be a number')
    .test('max-digits', 'Expense value must be max 8 digits', (value) => {
      if (!value) {
        return false;
      }
      const stringValue = value.toString(); // convert number to string
      return stringValue.length <= 8; // max 8 digits
    })
    .test('max-decimals', 'Expense value must have max 2 decimal places', (value) => {
      if (!value) {
        return false;
      }
      const decimalCount = (value.toString().split('.')[1] || []).length;
      return decimalCount <= 2;
    }),
  expenseTitle: yup
    .string()
    .required('Expense title is required')
    .min(2, 'Expense title must be at least 2 chars')
    .max(60, 'Expense title must be max 60 chars'),
  expenseNotes: yup.string().notRequired(),
  expenseDate: yup.string().required('Date is required'),
  expenseCategory: yup.string().test('is-category-selected', 'Category is required', (value) => {
    if (!value || Object.keys(value).length === 0) {
      return false;
    }
    return true;
  }),
  expenseAccount: yup.string().test('is-account-selected', 'Account is required', (value) => {
    if (!value || Object.keys(value).length === 0) {
      return false;
    }
    return true;
  }),
  expenseCurrency: yup.string().test('is-currency-selected', 'Currency is required', (value) => {
    if (!value || Object.keys(value).length === 0) {
      return false;
    }
    return true;
  }),
});
