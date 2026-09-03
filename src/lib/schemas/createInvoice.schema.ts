import * as yup from 'yup';

export const invoiceLineItemSchema = yup.object().shape({
  id: yup.string().optional(),
  name: yup.string().trim().required('Item description is required'),
  qty: yup
    .string()
    .required('Quantity is required')
    .test('is-number', 'Qty must be > 0', val => {
      const num = parseFloat(val || '0');
      return !isNaN(num) && num > 0;
    }),
  price: yup
    .string()
    .required('Price is required')
    .test('is-number', 'Price must be greater than 0', val => {
      const num = parseFloat(val || '0');
      return !isNaN(num) && num > 0;
    }),
  discount: yup.string().default('0').optional(),
  discount_type: yup.mixed<'%' | 'flat'>().oneOf(['%', 'flat']).default('%'),
  tax_percent: yup.string().default('18').optional(),
  total: yup.number().optional(),
});

export const createInvoiceSchema = yup.object().shape({
  items: yup
    .array()
    .of(invoiceLineItemSchema)
    .min(1, 'At least one line item is required')
    .required('Line items are required'),
  gstMode: yup
    .mixed<'none' | 'intra' | 'inter'>()
    .oneOf(['none', 'intra', 'inter'])
    .default('none'),
  paymentMode: yup
    .mixed<'Cash' | 'Card' | 'UPI' | 'Online' | 'Bank Transfer'>()
    .oneOf(['Cash', 'Card', 'UPI', 'Online', 'Bank Transfer'])
    .default('Cash'),
  paymentStatus: yup.mixed<'Paid' | 'Unpaid'>().oneOf(['Paid', 'Unpaid']).default('Unpaid'),
  notes: yup.string().optional().default(''),
});

export type TCreateInvoiceSchemaType = yup.InferType<typeof createInvoiceSchema>;
