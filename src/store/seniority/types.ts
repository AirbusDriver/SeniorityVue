import { SeniorityRecord } from '@/seniority/types';

export const NAMESPACE = "seniority";

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

export enum SeniorityGetterTypes {
  ALL_RECORDS = "ALL_RECORDS",
  HAS_RECORDS = "HAS_RECORDS",
  MOST_RECENT_RECORD = "MOST_RECENT_RECORD",
  RECORDS_BY_PUBLISHED_DATE = "RECORDS_BY_PUBLISHED_DATE",
  ALL_RECORD_SUMMARIES = "ALL_RECORD_SUMMARIES",
  GET_RECORD_FOR_ID = "GET_RECORD_FOR_ID",
}
