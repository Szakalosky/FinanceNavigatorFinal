import * as yup from 'yup';

export const initialBudgetSchema = yup.object().shape({
  initialBudgetValue: yup
    .number()
    .required('Budget value is required')
    .min(1, 'Budget value must be at least one digit')
    .test('not-starts-with-zero', 'Budget value cannot start with zero', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue[0] !== '0'; //first char is not zero check
    })
    .test('greater-than-zero', 'Expense value cannot be empty', (value) => {
      if (!value) {
        return false;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); //  number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Budget value must be a number')
    .test('max-digits', 'Budget value must be max 8 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); //  number to string
      return stringValue.length <= 8;
    })
    .test('max-decimals', 'Budget value must have max 2 decimal places', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const decimalCount = (value.toString().split('.')[1] || []).length;
      return decimalCount <= 2;
    }),
  initialCurrency: yup.string().test('is-currency-selected', 'Currency is required', (value) => {
    if (!value || Object.keys(value).length === 0) {
      return false;
    }
    return true;
  }),
});
