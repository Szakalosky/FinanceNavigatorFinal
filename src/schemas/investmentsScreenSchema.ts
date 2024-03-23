import * as yup from 'yup';

export const investmentsScreenSchema = yup.object().shape({
  investmentValue: yup
    .number()
    .required('Investment value is required')
    .min(1, 'Investment value must be at least one digit')
    .test('not-starts-with-zero', 'Investment value cannot start with zero', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); //  number to string
      return stringValue[0] !== '0'; //first char is not zero check
    })
    .test('greater-than-zero', 'Investment value cannot be empty', (value) => {
      if (!value) {
        return false;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); //  number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Investment value must be a number')
    .test('max-digits', 'Investment value must be max 8 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); //  number to string
      return stringValue.length <= 8;
    })
    .test('max-decimals', 'Investment value must have max 2 decimal places', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const decimalCount = (value.toString().split('.')[1] || []).length;
      return decimalCount <= 2;
    }),
  investmentTitle: yup
    .string()
    .required('Investment title is required')
    .min(2, 'Investment title must be at least 2 chars')
    .max(60, 'Investment title must be max 60 chars'),
  investmentNotes: yup.string().notRequired(),
  investmentDate: yup.string().required('Date is required'),
  investmentCategory: yup.string().test('is-category-selected', 'Category is required', (value) => {
    if (!value || Object.keys(value).length === 0) {
      return false;
    }
    return true;
  }),
  investmentAccount: yup.string().test('is-account-selected', 'Account is required', (value) => {
    if (!value || Object.keys(value).length === 0) {
      return false;
    }
    return true;
  }),
  investmentCurrency: yup
    .string()
    .test('is-investment-selected', 'Currency is required', (value) => {
      if (!value || Object.keys(value).length === 0) {
        return false;
      }
      return true;
    }),
});
