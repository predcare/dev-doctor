import * as yup from 'yup';

export interface TEMRUploadFormValues {
  category: string;
  title: string;
  file: {
    uri: string;
    name: string;
    type: string;
  } | null;
  notes?: string;
  shareWithPatient: boolean;
}

export const emrUploadSchema: yup.ObjectSchema<TEMRUploadFormValues> = yup.object().shape({
  category: yup.string().trim().required('Category is required'),
  title: yup.string().trim().required('Document title is required'),
  file: yup
    .object({
      uri: yup.string().required('File URI is required'),
      name: yup.string().required('File name is required'),
      type: yup.string().required('File type is required'),
    })
    .nullable()
    .defined('Please select a document file to upload')
    .test('file-required', 'Please select a document file to upload', value => !!value && !!value.uri),
  notes: yup.string().optional().default(''),
  shareWithPatient: yup.boolean().default(true),
});
