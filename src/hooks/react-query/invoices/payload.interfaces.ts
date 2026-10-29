export interface ICreateManualInvoicePayload {
  clinic_id: string;
  patient_id: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  patient_gender: string;
  patient_age?: string;
  patient_address?: string;
  appointment_id?: string;
  invoice_date?: string;
  payment_mode: string;
  payment_status: string;
  gst_type: string;
  items: ICreateManualItem[];
  notes: string;
}


export interface ICreateManualItem {
  item_name: string;
  hsn_sac: string;
  qty: number;
  unit_price: number;
  discount_percent: number;
  tax_rate: number;
}

export interface IUpdateManualInvoicePayload {
  invoice_id: string;
  payment_status?: string;
  payment?: {
    payment_method: string;
    payment_date: string;
    amount: string;
    payment_details: string;
  }[];
}
