import * as yup from 'yup';

export const AvailabilityFormSchema = yup.object().shape({
  editorTab: yup.string().oneOf(['specific', 'recurring', 'leave']).default('specific').required(),

  selectedDates: yup
    .array()
    .of(yup.string().required())
    .default([])
    .when('editorTab', {
      is: 'specific',
      then: schema => schema.min(1, 'Please select at least one specific date'),
      otherwise: schema => schema.optional(),
    }),

  recurringDays: yup
    .array()
    .of(yup.string().required())
    .default([])
    .when('editorTab', {
      is: 'recurring',
      then: schema => schema.min(1, 'Please select at least one recurring day'),
      otherwise: schema => schema.optional(),
    }),

  startDate: yup
    .string()
    .nullable()
    .default(null)
    .when('editorTab', {
      is: 'recurring',
      then: schema => schema.required('Start date is required').typeError('Start date is required'),
      otherwise: schema => schema.nullable().optional(),
    }),

  endDate: yup
    .string()
    .nullable()
    .default(null)
    .when('editorTab', {
      is: 'recurring',
      then: schema => schema.required('End date is required').typeError('End date is required'),
      otherwise: schema => schema.nullable().optional(),
    }),

  leaveDates: yup
    .array()
    .of(yup.string().required())
    .default([])
    .when(['editorTab', 'selectedDates', 'recurringDays'], {
      is: (editorTab: string, selectedDates: string[], recurringDays: string[]) =>
        editorTab === 'leave' &&
        (!selectedDates || selectedDates.length === 0) &&
        (!recurringDays || recurringDays.length === 0),
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
  hideFee: yup.boolean().default(false),
  requirePayment: yup.boolean().default(false),
  inPersonFee: yup
    .string()
    .default('')
    .when(['consultationType', 'requirePayment'], {
      is: (type: string, reqPayment: boolean) => type === 'in-person' || type === 'both',
      then: schema =>
        schema.test(
          'is-valid-in-person-fee',
          'In-person fee is required when online payment is enabled',
          function (val) {
            const { requirePayment } = this.parent;
            if (requirePayment) {
              if (!val || val.trim() === '') {
                return this.createError({ message: 'In-person fee is required when online payment is enabled' });
              }
              const num = Number(val);
              if (isNaN(num) || num <= 0) {
                return this.createError({ message: 'In-person fee must be greater than 0 when online payment is enabled' });
              }
              return true;
            } else {
              if (!val || val.trim() === '') return true;
              const num = Number(val);
              if (isNaN(num) || num < 0) {
                return this.createError({ message: 'Please enter a valid in-person fee' });
              }
              return true;
            }
          }
        ),
      otherwise: schema => schema.optional(),
    }),

  videoFee: yup
    .string()
    .default('')
    .when('consultationType', {
      is: (type: string) => type === 'video' || type === 'both',
      then: schema =>
        schema
          .required('Video fee is required')
          .test('is-valid-video-fee', 'Video fee is required and must be greater than 0', val => {
            if (!val || val.trim() === '') return false;
            const num = Number(val);
            return !isNaN(num) && num > 0;
          }),
      otherwise: schema => schema.optional(),
    }),
});

export type TAvailabilityFormValues = yup.InferType<typeof AvailabilityFormSchema>;
