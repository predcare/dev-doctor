import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import { ICommonRoot } from '../../../typescripts/interfaces/common.interfaces';
import {
  IInvoiceSettingRoot,
  IInvoiceStatsRoot,
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

export interface IGetMyAllInvoicesParams {
  page?: number;
  limit?: number;
  search?: string;
  payment_status?: string;
}

export const getMyAllInvoices = async (params: IGetMyAllInvoicesParams) => {
  const cleanParams: Record<string, any> = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  };

  if (params.search && params.search.trim() !== '') {
    cleanParams.search = params.search.trim();
  }

  if (params.payment_status && params.payment_status.toLowerCase() !== 'all') {
    cleanParams.payment_status = params.payment_status.toLowerCase();
  }

  const res = await axiosInstance.get<IMyInvoiceListRoot>(`${endpoints.invoices.getAll}`, {
    params: cleanParams,
  });
  return res.data;
};

export const createInvoices = async (body: any) => {
  const res = await axiosInstance.post<ICommonRoot>(`${endpoints.invoices.create}`, body);
  return res.data;
};

export const getInvoicesStats = async (params: {
  clinic_id: string;
  end_date: string;
  start_date: string;
}) => {
  const res = await axiosInstance.get<IInvoiceStatsRoot>(`${endpoints.invoices.stats}`);
  return res.data;
};
