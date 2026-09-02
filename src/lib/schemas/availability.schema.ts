import * as yup from 'yup';

export const AvailabilityFormSchema = yup.object().shape({
  editorTab: yup
    .string()
    .oneOf(['specific', 'recurring', 'leave'])
    .default('specific')
    .required(),

  selectedDates: yup.array().of(yup.string().required()).default([]).when('editorTab', {
    is: 'specific',
    then: schema => schema.min(1, 'Please select at least one specific date'),
    otherwise: schema => schema.optional(),
  }),

  recurringDays: yup.array().of(yup.string().required()).default([]).when('editorTab', {
    is: 'recurring',
    then: schema => schema.min(1, 'Please select at least one recurring day'),
    otherwise: schema => schema.optional(),
  }),

  startDate: yup.string().nullable().default(null).when('editorTab', {
    is: 'recurring',
    then: schema => schema.required('Start date is required').typeError('Start date is required'),
    otherwise: schema => schema.nullable().optional(),
  }),

  endDate: yup.string().nullable().default(null).when('editorTab', {
    is: 'recurring',
    then: schema => schema.required('End date is required').typeError('End date is required'),
    otherwise: schema => schema.nullable().optional(),
  }),

  leaveDates: yup.array().of(yup.string().required()).default([]).when('editorTab', {
    is: 'leave',
    then: schema => schema.min(1, 'Please select at least one leave date'),
    otherwise: schema => schema.optional(),
  }),

  fromTime: yup
    .object()
    .shape({
      hour: yup.string().required(),
      minute: yup.string().required(),
      period: yup.string().oneOf(['AM', 'PM']).required(),
    })
    .default({ hour: '09', minute: '00', period: 'AM' })
    .required(),

  toTime: yup
    .object()
    .shape({
      hour: yup.string().required(),
      minute: yup.string().required(),
      period: yup.string().oneOf(['AM', 'PM']).required(),
    })
    .default({ hour: '05', minute: '00', period: 'PM' })
    .required(),

  consultationType: yup
    .string()
    .oneOf(['in-person', 'video', 'both'])
    .default('in-person')
    .required(),

  slotDuration: yup
    .number()
    .min(5, 'Slot duration must be at least 5 minutes')
    .default(30)
    .required(),

  inPersonFee: yup.string().default('').when('consultationType', {
    is: (type: string) => type === 'in-person' || type === 'both',
    then: schema =>
      schema
        .required('In-person fee is required')
        .test('is-valid-fee', 'Please enter a valid in-person fee', val => {
          if (!val || val.trim() === '') return false;
          const num = Number(val);
          return !isNaN(num) && num >= 0;
        }),
    otherwise: schema => schema.optional(),
  }),

  videoFee: yup.string().default('').when('consultationType', {
    is: (type: string) => type === 'video' || type === 'both',
    then: schema =>
      schema
        .required('Video consultation fee is required')
        .test('is-valid-fee', 'Please enter a valid video fee', val => {
          if (!val || val.trim() === '') return false;
          const num = Number(val);
          return !isNaN(num) && num >= 0;
        }),
    otherwise: schema => schema.optional(),
  }),

  hideFee: yup.boolean().default(false),
  requirePayment: yup.boolean().default(false),
});

export type TAvailabilityFormValues = yup.InferType<typeof AvailabilityFormSchema>;
