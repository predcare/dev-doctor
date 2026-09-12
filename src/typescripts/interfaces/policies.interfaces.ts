export interface IGetPoliciesRoot {
  status: number;
  success: boolean;
  message: string;
  data: IPolicyDoc;
}

export interface IPolicyDoc {
  audience: string;
  policies: IPolicies;
}

export interface IPolicies {
  terms: ITerms;
  privacy: IPrivacy;
  informed_consent: IInformedConsent;
}

export interface ITerms {
  id: number;
  type: string;
  title: string;
  version: number;
  content: string;
  status: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  document_kind: string;
  is_accepted: boolean;
}

export interface IPrivacy {
  id: number;
  type: string;
  title: string;
  version: number;
  content: string;
  status: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  document_kind: string;
  is_accepted: boolean;
}

export interface IInformedConsent {
  id: number;
  type: string;
  title: string;
  version: number;
  content: string;
  status: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  document_kind: string;
  is_accepted: boolean;
}

export interface IPolicyAcceptanceDocumentItem {
  document_kind: 'terms' | 'privacy' | 'informed_consent' | string;
  document_id: number;
  document_version: number;
}

export interface IPolicyAcceptancePayload {
  audience?: 'doctor' | 'patient';
  source?: 'signup' | 'forced_reaccept' | 'mobile_app' | 'web_portal';
  documents?: IPolicyAcceptanceDocumentItem[];
}

