import * as yup from 'yup';

export const AvailabilityFormSchema = yup.object().shape({
  date_selection_mode: yup
    .string()
    .oneOf(['specific', 'recurring'])
    .default('specific')
    .required('Date selection mode is required'),

  selected_dates: yup
    .array()
    .of(yup.string().required())
    .default([])
    .when('date_selection_mode', {
      is: 'specific',
      then: schema =>
        schema
          .min(1, 'Please select at least one date for specific mode')
          .required('Selected dates are required'),
      otherwise: schema => schema.default([]),
    }),

  recurring_days: yup
    .array()
    .of(yup.string().required())
    .default([])
    .when('date_selection_mode', {
      is: 'recurring',
      then: schema =>
        schema
          .min(1, 'Please select at least one recurring day')
          .required('Recurring days are required'),
      otherwise: schema => schema.default([]),
    }),

  recurring_start_date: yup
    .string()
    .nullable()
    .when('date_selection_mode', {
      is: 'recurring',
      then: schema => schema.required('Recurring start date is required'),
      otherwise: schema => schema.nullable().default(null),
    }),

  recurring_end_date: yup
    .string()
    .nullable()
    .when('date_selection_mode', {
      is: 'recurring',
      then: schema => schema.required('Recurring end date is required'),
      otherwise: schema => schema.nullable().default(null),
    }),

  leave_dates: yup.array().of(yup.string().required()).default([]),

  from_time: yup.string().required('Start time is required'),
  to_time: yup.string().required('End time is required'),

  consultation_type: yup
    .string()
    .oneOf(['in-person', 'video', 'both'])
    .default('in-person')
    .required('Consultation type is required'),

  slot_duration: yup
    .number()
    .typeError('Slot duration must be a number')
    .min(5, 'Minimum 5 minutes')
    .max(240, 'Maximum 240 minutes')
    .default(30)
    .required('Slot duration is required'),

  in_person_fee: yup
    .mixed()
    .test('is-valid-in-person-fee', 'In-person fee is required', function (value) {
      const type = this.parent.consultation_type;
      if (type === 'in-person' || type === 'both') {
        if (value === '' || value === null || value === undefined) return false;
        const num = Number(value);
        return !isNaN(num) && num >= 0;
      }
      return true;
    })
    .default(''),

  video_fee: yup
    .mixed()
    .test('is-valid-video-fee', 'Video fee is required', function (value) {
      const type = this.parent.consultation_type;
      if (type === 'video' || type === 'both') {
        if (value === '' || value === null || value === undefined) return false;
        const num = Number(value);
        return !isNaN(num) && num >= 0;
      }
      return true;
    })
    .default(''),

  hide_fee: yup.boolean().default(false),
  require_payment: yup.boolean().default(false),
  clinic_id: yup.mixed().default(1),
});

export type TAvailabilityFormSchemaType = yup.InferType<typeof AvailabilityFormSchema>;
