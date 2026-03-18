import * as yup from 'yup';

export const reviewStarScreenSchema = yup.object().shape({
  reviewStarValue: yup
    .number()
    .required('Review value is required')
    .transform((originalValue) => {
      return isNaN(originalValue) ? undefined : parseFloat(originalValue);
    })
    .typeError('Review value must be a number'),
});
