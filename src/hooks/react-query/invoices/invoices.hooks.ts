import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { MyInvoices } from '../query.keys';
import {
  createInvoices,
  getInvoicePdf,
  getInvoiceSettings,
  getInvoicesStats,
  getMyAllInvoices,
  getMyPatientInvoices,
  IGetMyAllInvoicesParams,
} from './invoices.funcs';

export const useMPatientsInvoices = (params?: { doctorId?: number | string }) =>
  useQuery({
    queryKey: [MyInvoices.PatientInvoices, params],
    queryFn: () => getMyPatientInvoices(params?.doctorId!),
    enabled: !!params?.doctorId,
    select: v => v.data || (v as any).invoices,
  });

export const useDownloadInvoicePdf = () =>
  useMutation({
    mutationFn: (invoiceId: number | string) => getInvoicePdf(invoiceId),
  });

export const useInvoiceSettings = () =>
  useQuery({
    queryKey: [MyInvoices.InvoiceSettings],
    queryFn: () => getInvoiceSettings(),
    select: v => (v as any)?.settings || (v as any)?.data || v,
  });

export const useMyAllInvoices = (params?: Omit<IGetMyAllInvoicesParams, 'page'>) =>
  useInfiniteQuery({
    queryKey: [MyInvoices.AllInvoices, params],
    queryFn: ({ pageParam = 1 }) =>
      getMyAllInvoices({
        ...params,
        page: Number(pageParam),
        limit: params?.limit ?? 10,
      }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (lastPage?.meta?.hasNextPage) {
        return (lastPage.meta.page || 1) + 1;
      }
      return undefined;
    },
  });

export const useCreateInvoices = () =>
  useMutation({
    mutationFn: createInvoices,
  });

export const useInvoicesStats = (params?: {
  clinic_id?: string;
  end_date?: string;
  start_date?: string;
  category?: string;
}) =>
  useQuery({
    queryKey: [MyInvoices.InvoicesStats, params],
    queryFn: () => getInvoicesStats(params as any),
    select: v => v?.data,
  });
