import RNFS from 'react-native-fs';
import axiosInstance from '../../../api/apiClient';
import { endpoints } from '../../../api/endpoints';
import { arrayBufferToBase64 } from '../../../lib/common/file.utils';
import { ICommonRoot } from '../../../typescripts/interfaces/common.interfaces';
import {
  IPatientPrescriptionInfoRoot,
  IPatientPrescriptionListRoot,
} from '../../../typescripts/interfaces/prescriptions.interfaces';
import {
  ICreatePrescriptionPayload,
  IUpdatePrescriptionPayload,
  IUpsertDraftPrescriptionPayload,
} from './payload.interfaces';

export const createPrescription = async (payload: ICreatePrescriptionPayload) => {
  const res = await axiosInstance.post<ICommonRoot>(endpoints.prescritions.create, payload);
  return res.data;
};

export const upsertDraftPrescription = async ({
  id,
  payload,
}: {
  id?: number | string;
  payload: IUpsertDraftPrescriptionPayload;
}) => {
  const res = await axiosInstance.post<ICommonRoot>(
    endpoints.prescritions.upsertDraft(id),
    payload
  );
  return res.data;
};

export const updatePrescription = async ({
  id,
  payload,
}: {
  id: number | string;
  payload: IUpdatePrescriptionPayload;
}) => {
  const res = await axiosInstance.put<ICommonRoot>(endpoints.prescritions.update(id), payload);
  return res.data;
};

export const getPrescriptionDetails = async (id: string | number) => {
  const res = await axiosInstance.get<IPatientPrescriptionInfoRoot>(endpoints.prescritions.get(id));
  return res.data;
};

export const resendPrescriptionEmail = async (id: string | number) => {
  const res = await axiosInstance.post<ICommonRoot>(endpoints.prescritions.sendAgain(id));
  return res.data;
};

export const downloadPrescriptionPdf = async ({
  id,
  onProgress,
}: {
  id: string | number;
  onProgress?: (progressPercentage: number) => void;
}): Promise<string> => {
  const filename = `Prescription_RX${String(id).padStart(6, '0')}.pdf`;
  const destPath = `${RNFS.CachesDirectoryPath}/${filename}`;

  const response = await axiosInstance.get(endpoints.prescritions.downloadPrescription(id), {
    responseType: 'arraybuffer',
    onDownloadProgress: e => {
      if (e.total && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    },
  });

  const base64 = arrayBufferToBase64(response.data as ArrayBuffer);
  if (await RNFS.exists(destPath)) {
    await RNFS.unlink(destPath);
  }
  await RNFS.writeFile(destPath, base64, 'base64');
  return destPath;
};

export const getAllPrescriptionsForDoctor = async (doctorId: string | number) => {
  const res = await axiosInstance.get<IPatientPrescriptionListRoot>(
    endpoints.prescritions.getAll(doctorId)
  );
  return res.data;
};
