import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import {
  IInvoiceSettingRoot,
  IMyInvoiceListRoot,
} from '../../../typescripts/interfaces/invoices.interfaces';

export const getMyPatientInvoices = async (doctorId: number | string) => {
  const res = await axiosInstance.get<IMyInvoiceListRoot>(
    `${endpoints.invoices.patientInvoices}${doctorId}`
  );
  return res.data;
};

export const getInvoicePdf = async (invoiceId: number | string): Promise<ArrayBuffer> => {
  const res = await axiosInstance.get(endpoints.invoices.downloadPdf(invoiceId), {
    responseType: 'arraybuffer',
  });

  return res.data as ArrayBuffer;
};
export const getInvoiceSettings = async (doctorId: number | string) => {
  const res = await axiosInstance.get<IInvoiceSettingRoot>(
    `${endpoints.invoices.invoiceSettings}${doctorId}`
  );
  return res.data;
};
