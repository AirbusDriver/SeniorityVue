import { SeniorityRecord } from '@/seniority/types';

export interface SeniorityState {
  records: SeniorityRecord[];
}

export enum SeniorityMutationTypes {
  ADD_SENIORITY_RECORD = "ADD_SENIORITY_RECORD"
}

export enum SeniorityActionTypes {
  ADD_SENIORITY_RECORD = "ADD_SENIORITY_RECORD",
  LOAD_SENIORITY_RECORDS = "LOAD_SENIORITY_RECORDS",
}