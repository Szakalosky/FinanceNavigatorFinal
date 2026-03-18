import * as yup from 'yup';

export const limitFoodBudgetScreenSchema = yup.object().shape({
  limitFoodBudgetValue: yup
    .number()
    .required('Limit Food Budget value is required')
    .min(3, 'Limit Food Budget value must be at least 3 digits')
    .test('min-digits', 'Limit Food Budget value must be minimum 3 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length >= 3;
    })
    .test('not-starts-with-zero', 'Limit Food Budget value cannot start with zero', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue[0] !== '0'; //first char is not zero check
    })
    .test('greater-than-zero', 'Limit Food Budget value cannot be empty', (value) => {
      if (!value) {
        return false;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Limit Food Budget value must be a number')
    .test('max-digits', 'Limit Food Budget value must be max 8 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length <= 8;
    })
    .test('max-decimals', 'Limit Food Budget value must have max 2 decimal places', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const decimalCount = (value.toString().split('.')[1] || []).length;
      return decimalCount <= 2;
    }),
  limitBudgetCurrency: yup
    .string()
    .test('is-limit-budget-selected', 'Currency is required', (value) => {
      if (!value || Object.keys(value).length === 0) {
        return false;
      }
      return true;
    }),
});

export const limitShoppingBudgetScreenSchema = yup.object().shape({
  limitShoppingBudgetValue: yup
    .number()
    .required('Limit Shopping Budget value is required')
    .min(3, 'Limit Shopping Budget value must be at least 3 digits')
    .test('min-digits', 'Limit Shopping Budget value must be minimum 3 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length >= 3;
    })
    .test('not-starts-with-zero', 'Limit Shopping Budget value cannot start with zero', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue[0] !== '0'; //first char is not zero check
    })
    .test('greater-than-zero', 'Limit Shopping Budget value cannot be empty', (value) => {
      if (!value) {
        return false;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Limit Shopping Budget value must be a number')
    .test('max-digits', 'Limit Shopping Budget value must be max 8 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length <= 8;
    })
    .test('max-decimals', 'Limit Shopping Budget value must have max 2 decimal places', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const decimalCount = (value.toString().split('.')[1] || []).length;
      return decimalCount <= 2;
    }),
  limitShoppingBudgetCurrency: yup
    .string()
    .test('is-limit-budget-selected', 'Currency is required', (value) => {
      if (!value || Object.keys(value).length === 0) {
        return false;
      }
      return true;
    }),
});

export const limitHomeBudgetScreenSchema = yup.object().shape({
  limitHomeBudgetValue: yup
    .number()
    .required('Limit Home Budget value is required')
    .min(3, 'Limit Home Budget value must be at least 3 digits')
    .test('min-digits', 'Limit Home Budget value must be minimum 3 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length >= 3;
    })
    .test('not-starts-with-zero', 'Limit Home Budget value cannot start with zero', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue[0] !== '0'; //first char is not zero check
    })
    .test('greater-than-zero', 'Limit Home Budget value cannot be empty', (value) => {
      if (!value) {
        return false;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Limit Home Budget value must be a number')
    .test('max-digits', 'Limit Home Budget value must be max 8 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length <= 8;
    })
    .test('max-decimals', 'Limit Home Budget value must have max 2 decimal places', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const decimalCount = (value.toString().split('.')[1] || []).length;
      return decimalCount <= 2;
    }),
  limitHomeBudgetCurrency: yup
    .string()
    .test('is-limit-budget-selected', 'Currency is required', (value) => {
      if (!value || Object.keys(value).length === 0) {
        return false;
      }
      return true;
    }),
});

export const limitPublicTransportBudgetScreenSchema = yup.object().shape({
  limitPublicTransportBudgetValue: yup
    .number()
    .required('Limit Public Transport Budget value is required')
    .min(2, 'Limit Public Transport Budget value must be at least 2 digits')
    .test('min-digits', 'Limit Public Transport Budget value must be minimum 2 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length >= 2;
    })
    .test(
      'not-starts-with-zero',
      'Limit Public Transport Budget value cannot start with zero',
      (value) => {
        if (!value) {
          return true;
        } // if value is empty then validation is ok
        const stringValue = value.toString(); // convert number to string
        return stringValue[0] !== '0'; //first char is not zero check
      }
    )
    .test('greater-than-zero', 'Limit Public Transport Budget value cannot be empty', (value) => {
      if (!value) {
        return false;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Limit Public Transport Budget value must be a number')
    .test('max-digits', 'Limit Public Transport Budget value must be max 8 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length <= 8;
    })
    .test(
      'max-decimals',
      'Limit Public Transport Budget value must have max 2 decimal places',
      (value) => {
        if (!value) {
          return true;
        } // if value is empty then validation is ok
        const decimalCount = (value.toString().split('.')[1] || []).length;
        return decimalCount <= 2;
      }
    ),
  limitPublicTransportBudgetCurrency: yup
    .string()
    .test('is-limit-budget-selected', 'Currency is required', (value) => {
      if (!value || Object.keys(value).length === 0) {
        return false;
      }
      return true;
    }),
});

export const limitCarBudgetScreenSchema = yup.object().shape({
  limitCarBudgetValue: yup
    .number()
    .required('Limit Car Budget value is required')
    .min(3, 'Limit Car Budget value must be at least 3 digits')
    .test('min-digits', 'Limit Car Budget value must be minimum 3 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length >= 3;
    })
    .test('not-starts-with-zero', 'Limit Car Budget value cannot start with zero', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue[0] !== '0'; //first char is not zero check
    })
    .test('greater-than-zero', 'Limit Car Budget value cannot be empty', (value) => {
      if (!value) {
        return false;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Limit Car Budget value must be a number')
    .test('max-digits', 'Limit Car Budget value must be max 8 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length <= 8;
    })
    .test('max-decimals', 'Limit Car Budget value must have max 2 decimal places', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const decimalCount = (value.toString().split('.')[1] || []).length;
      return decimalCount <= 2;
    }),
  limitCarBudgetCurrency: yup
    .string()
    .test('is-limit-budget-selected', 'Currency is required', (value) => {
      if (!value || Object.keys(value).length === 0) {
        return false;
      }
      return true;
    }),
});

export const limitLoanBudgetScreenSchema = yup.object().shape({
  limitLoanBudgetValue: yup
    .number()
    .required('Limit Loan Budget value is required')
    .min(5, 'Limit Loan Budget value must be at least 5 digits')
    .test('min-digits', 'Limit Public Transport Budget value must be minimum 5 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length >= 5;
    })
    .test('not-starts-with-zero', 'Limit Loan Budget value cannot start with zero', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue[0] !== '0'; //first char is not zero check
    })
    .test('greater-than-zero', 'Limit Loan Budget value cannot be empty', (value) => {
      if (!value) {
        return false;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Limit Loan Budget value must be a number')
    .test('max-digits', 'Limit Loan Budget value must be max 8 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length <= 8;
    })
    .test('max-decimals', 'Limit Loan Budget value must have max 2 decimal places', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const decimalCount = (value.toString().split('.')[1] || []).length;
      return decimalCount <= 2;
    }),
  limitLoanBudgetCurrency: yup
    .string()
    .test('is-limit-budget-selected', 'Currency is required', (value) => {
      if (!value || Object.keys(value).length === 0) {
        return false;
      }
      return true;
    }),
});

export const limitEntertainmentBudgetScreenSchema = yup.object().shape({
  limitEntertainmentBudgetValue: yup
    .number()
    .required('Limit Entertainment Budget value is required')
    .min(2, 'Limit Entertainment Budget value must be at least 2 digits')
    .test('min-digits', 'Limit Entertainment Budget value must be minimum 2 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length >= 2;
    })
    .test(
      'not-starts-with-zero',
      'Limit Entertainment Budget value cannot start with zero',
      (value) => {
        if (!value) {
          return true;
        } // if value is empty then validation is ok
        const stringValue = value.toString(); // convert number to string
        return stringValue[0] !== '0'; //first char is not zero check
      }
    )
    .test('greater-than-zero', 'Limit Entertainment Budget value cannot be empty', (value) => {
      if (!value) {
        return false;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Limit Entertainment Budget value must be a number')
    .test('max-digits', 'Limit Entertainment Budget value must be max 8 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length <= 8;
    })
    .test(
      'max-decimals',
      'Limit Entertainment Budget value must have max 2 decimal places',
      (value) => {
        if (!value) {
          return true;
        } // if value is empty then validation is ok
        const decimalCount = (value.toString().split('.')[1] || []).length;
        return decimalCount <= 2;
      }
    ),
  limitEntertainmentBudgetCurrency: yup
    .string()
    .test('is-limit-budget-selected', 'Currency is required', (value) => {
      if (!value || Object.keys(value).length === 0) {
        return false;
      }
      return true;
    }),
});

export const limitElectronicsBudgetScreenSchema = yup.object().shape({
  limitElectronicsBudgetValue: yup
    .number()
    .required('Limit Electronics Budget value is required')
    .min(2, 'Limit Electronics Budget value must be at least 2 digits')
    .test('min-digits', 'Limit Electronics Budget value must be minimum 2 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length >= 2;
    })
    .test(
      'not-starts-with-zero',
      'Limit Electronics Budget value cannot start with zero',
      (value) => {
        if (!value) {
          return true;
        } // if value is empty then validation is ok
        const stringValue = value.toString(); // convert number to string
        return stringValue[0] !== '0'; //first char is not zero check
      }
    )
    .test('greater-than-zero', 'Limit Electronics Budget value cannot be empty', (value) => {
      if (!value) {
        return false;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Limit Electronics Budget value must be a number')
    .test('max-digits', 'Limit Electronics Budget value must be max 8 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length <= 8;
    })
    .test(
      'max-decimals',
      'Limit Electronics Budget value must have max 2 decimal places',
      (value) => {
        if (!value) {
          return true;
        } // if value is empty then validation is ok
        const decimalCount = (value.toString().split('.')[1] || []).length;
        return decimalCount <= 2;
      }
    ),
  limitElectronicsBudgetCurrency: yup
    .string()
    .test('is-limit-budget-selected', 'Currency is required', (value) => {
      if (!value || Object.keys(value).length === 0) {
        return false;
      }
      return true;
    }),
});

export const limitEducationBudgetScreenSchema = yup.object().shape({
  limitEducationBudgetValue: yup
    .number()
    .required('Limit Education Budget value is required')
    .min(2, 'Limit Education Budget value must be at least 2 digits')
    .test('min-digits', 'Limit Education Budget value must be minimum 2 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length >= 2;
    })
    .test(
      'not-starts-with-zero',
      'Limit Education Budget value cannot start with zero',
      (value) => {
        if (!value) {
          return true;
        } // if value is empty then validation is ok
        const stringValue = value.toString(); // convert number to string
        return stringValue[0] !== '0'; //first char is not zero check
      }
    )
    .test('greater-than-zero', 'Limit Education Budget value cannot be empty', (value) => {
      if (!value) {
        return false;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Limit Education Budget value must be a number')
    .test('max-digits', 'Limit Education Budget value must be max 8 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length <= 8;
    })
    .test(
      'max-decimals',
      'Limit Education Budget value must have max 2 decimal places',
      (value) => {
        if (!value) {
          return true;
        } // if value is empty then validation is ok
        const decimalCount = (value.toString().split('.')[1] || []).length;
        return decimalCount <= 2;
      }
    ),
  limitEducationBudgetCurrency: yup
    .string()
    .test('is-limit-budget-selected', 'Currency is required', (value) => {
      if (!value || Object.keys(value).length === 0) {
        return false;
      }
      return true;
    }),
});

export const limitGiftsBudgetScreenSchema = yup.object().shape({
  limitGiftsBudgetValue: yup
    .number()
    .required('Limit Gifts Budget value is required')
    .min(2, 'Limit Gifts Budget value must be at least 2 digits')
    .test('min-digits', 'Limit Gifts Budget value must be minimum 2 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length >= 2;
    })
    .test('not-starts-with-zero', 'Limit Gifts Budget value cannot start with zero', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue[0] !== '0'; //first char is not zero check
    })
    .test('greater-than-zero', 'Limit Gifts Budget value cannot be empty', (value) => {
      if (!value) {
        return false;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Limit Gifts Budget value must be a number')
    .test('max-digits', 'Limit Gifts Budget value must be max 8 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length <= 8;
    })
    .test('max-decimals', 'Limit Gifts Budget value must have max 2 decimal places', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const decimalCount = (value.toString().split('.')[1] || []).length;
      return decimalCount <= 2;
    }),
  limitGiftsBudgetCurrency: yup
    .string()
    .test('is-limit-budget-selected', 'Currency is required', (value) => {
      if (!value || Object.keys(value).length === 0) {
        return false;
      }
      return true;
    }),
});

export const limitTrainingBudgetScreenSchema = yup.object().shape({
  limitTrainingBudgetValue: yup
    .number()
    .required('Limit Training Budget value is required')
    .min(2, 'Limit Training Budget value must be at least 2 digits')
    .test('min-digits', 'Limit Training Budget value must be minimum 2 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length >= 2;
    })
    .test('not-starts-with-zero', 'Limit Training Budget value cannot start with zero', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue[0] !== '0'; //first char is not zero check
    })
    .test('greater-than-zero', 'Limit Training Budget value cannot be empty', (value) => {
      if (!value) {
        return false;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Limit Training Budget value must be a number')
    .test('max-digits', 'Limit Training Budget value must be max 8 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length <= 8;
    })
    .test('max-decimals', 'Limit Training Budget value must have max 2 decimal places', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const decimalCount = (value.toString().split('.')[1] || []).length;
      return decimalCount <= 2;
    }),
  limitTrainingBudgetCurrency: yup
    .string()
    .test('is-limit-budget-selected', 'Currency is required', (value) => {
      if (!value || Object.keys(value).length === 0) {
        return false;
      }
      return true;
    }),
});

export const limitHealthBudgetScreenSchema = yup.object().shape({
  limitHealthBudgetValue: yup
    .number()
    .required('Limit Health Budget value is required')
    .min(2, 'Limit Health Budget value must be at least 2 digits')
    .test('min-digits', 'Limit Health Budget value must be minimum 2 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length >= 2;
    })
    .test('not-starts-with-zero', 'Limit Health Budget value cannot start with zero', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue[0] !== '0'; //first char is not zero check
    })
    .test('greater-than-zero', 'Limit Health Budget value cannot be empty', (value) => {
      if (!value) {
        return false;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Limit Health Budget value must be a number')
    .test('max-digits', 'Limit Health Budget value must be max 8 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length <= 8;
    })
    .test('max-decimals', 'Limit Health Budget value must have max 2 decimal places', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const decimalCount = (value.toString().split('.')[1] || []).length;
      return decimalCount <= 2;
    }),
  limitHealthBudgetCurrency: yup
    .string()
    .test('is-limit-budget-selected', 'Currency is required', (value) => {
      if (!value || Object.keys(value).length === 0) {
        return false;
      }
      return true;
    }),
});

export const limitHolidaysBudgetScreenSchema = yup.object().shape({
  limitHolidaysBudgetValue: yup
    .number()
    .required('Limit Holidays Budget value is required')
    .min(2, 'Limit Holidays Budget value must be at least 2 digits')
    .test('min-digits', 'Limit Holidays Budget value must be minimum 2 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length >= 2;
    })
    .test('not-starts-with-zero', 'Limit Holidays Budget value cannot start with zero', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue[0] !== '0'; //first char is not zero check
    })
    .test('greater-than-zero', 'Limit Holidays Budget value cannot be empty', (value) => {
      if (!value) {
        return false;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length > 0; // Check if value is greater than 0
    })
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Limit Holidays Budget value must be a number')
    .test('max-digits', 'Limit Holidays Budget value must be max 8 digits', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const stringValue = value.toString(); // convert number to string
      return stringValue.length <= 8;
    })
    .test('max-decimals', 'Limit Holidays Budget value must have max 2 decimal places', (value) => {
      if (!value) {
        return true;
      } // if value is empty then validation is ok
      const decimalCount = (value.toString().split('.')[1] || []).length;
      return decimalCount <= 2;
    }),
  limitHolidaysBudgetCurrency: yup
    .string()
    .test('is-limit-budget-selected', 'Currency is required', (value) => {
      if (!value || Object.keys(value).length === 0) {
        return false;
      }
      return true;
    }),
});
