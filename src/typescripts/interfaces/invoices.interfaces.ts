export interface IMyInvoiceListRoot {
  success: boolean;
  invoices: IInvoiceDoc[];
}

export interface IInvoiceDoc {
  id: number;
  invoice_number: string;
  appointment_id?: number;
  doctor_id: number;
  clinic_id: number;
  patient_id: number;
  items: Item[];
  gst_type: string;
  payment_mode: string;
  payment_status: string;
  category: string;
  notes: string;
  subtotal: string;
  total_discount: string;
  cgst: string;
  sgst: string;
  igst: string;
  grand_total: string;
  pdf_path?: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  deleted_by: any;
  patient_name: string;
}

export interface Item {
  id: string;
  qty: string;
  name: string;
  price: string;
  total: number;
  discount: string;
  tax_percent: string;
  discount_type: string;
  hsn?: string;
  discounted_price?: number;
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
