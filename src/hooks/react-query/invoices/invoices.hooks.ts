import { useMutation, useQuery } from '@tanstack/react-query';
import { MyInvoices } from '../query.keys';
import {
  createInvoices,
  getInvoicePdf,
  getInvoiceSettings,
  getMyAllInvoices,
  getMyPatientInvoices,
} from './invoices.funcs';

export const useMPatientsInvoices = (params?: { doctorId?: number | string }) =>
  useQuery({
    queryKey: [MyInvoices.PatientInvoices, params],
    queryFn: () => getMyPatientInvoices(params?.doctorId!),
    enabled: !!params?.doctorId,
    select: v => v.invoices,
  });

export const useDownloadInvoicePdf = () =>
  useMutation({
    mutationFn: (invoiceId: number | string) => getInvoicePdf(invoiceId),
  });

export const useInvoiceSettings = (params?: { doctorId?: number | string }) =>
  useQuery({
    queryKey: [MyInvoices.InvoiceSettings, params],
    queryFn: () => getInvoiceSettings(params?.doctorId!),
    enabled: !!params?.doctorId,
    select: v => v.settings,
  });

export const useMyAllInvoices = (params?: { doctorId?: number | string }) =>
  useQuery({
    queryKey: [MyInvoices.AllInvoices, params],
    queryFn: () => getMyAllInvoices(params?.doctorId!),
    enabled: !!params?.doctorId,
    select: v => v.invoices,
  });

export const useCreateInvoices = () =>
  useMutation({
    mutationFn: createInvoices,
  });
