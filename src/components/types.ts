import { PilotRecord } from '@/seniority/types';


export type SeniorityTableItem = PilotRecord & {
  formattedDate: string;
};