import { IRootResponse } from './common.interfaces';

export type TStatsInfoRoot = IRootResponse<IStatsInfo>;

export interface IStatsInfo {
  upcoming_appointments: number;
  week_appointments: number;
  month_appointments: number;
  earnings: number;
  total_patients: number;
}
