import { IRootResponse } from './common.interfaces';
export type IMyInvoiceListRoot = IRootResponse<IInvoiceDoc[]>;

export type IInvoiceStatsRoot = IRootResponse<IInvoiceStatsDoc>;
export interface IInvoiceItem {
  id?: string;
  qty: number | string;
  item_name?: string;
  name?: string;
  unit_price?: number | string;
  price?: number | string;
  amount?: number | string;
  total?: number | string;
  discount?: number | string;
  discount_percent?: number | string;
  tax_rate?: number | string;
  tax_percent?: number | string;
  discount_type?: string;
  hsn_sac?: string;
  hsn?: string;
  discounted_price?: number;
}

export type Item = IInvoiceItem;

export interface IInvoiceDoc {
  id: string | number;
  invoice_number: string;
  appointment_id?: string | number | null;
  doctor_id: string | number;
  clinic_id: string | number;
  patient_id?: string | number | null;
  patient_name?: string;
  items: IInvoiceItem[];
  gst_type: string;
  payment_mode: string;
  payment_status: string;
  category: string;
  notes?: string;
  subtotal: number | string;
  total_discount: number | string;
  cgst: number | string;
  sgst: number | string;
  igst: number | string;
  grand_total: number | string;
  pdf_path?: string;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: any;
  deleted_by?: any;
}

export interface IInvoiceSettingRoot {
  success: boolean;
  settings: IInvoiceSettingsDoc;
}

export interface IInvoiceSettingsDoc {
  clinic_name: string;
  clinic_address: string;
  clinic_phone: any;
  clinic_email: string;
  clinic_gstin: any;
  reg_no: string;
  header_note: any;
  footer_note: any;
  terms_conditions: any;
  invoice_prefix: string;
  gst_type: string;
  signature_image_url: any;
  generated_sig_text: any;
  auto_loaded_from_clinic: boolean;
}

export interface IInvoiceStatsDoc {
  total_collected: number;
  total_outstanding: number;
  total_overdue: number;
  total_invoiced_amount: number;
  counts: {
    total: number;
    paid: number;
    unpaid: number;
    overdue: number;
  };
}
