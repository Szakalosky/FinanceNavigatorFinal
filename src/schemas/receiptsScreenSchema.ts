import * as yup from 'yup';

export const receiptItemSchema = yup.object().shape({
  description: yup.string().required(),
  quantity: yup.number().required(),
  unitPrice: yup.number().required(),
  totalAmount: yup.number().required(),
});

export const receiptsScreenSchema = yup.object().shape({
  category: yup.string().required(),
  currency: yup.string().required(),
  documentType: yup.string().required(),
  supplierAddress: yup.string().required(),
  supplierName: yup.string().required(),
  totalAmount: yup.number().transform((originalValue) => {
    return isNaN(originalValue) ? undefined : parseFloat(originalValue);
  }),
  receiptItems: yup.array().of(receiptItemSchema).required(),
  createdAt: yup.string().required(),
});
