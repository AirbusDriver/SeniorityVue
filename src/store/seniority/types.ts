import { SeniorityRecord, SeniorityRecordSummary, PilotRecord } from '@/seniority/types';

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

export interface DbSeniorityListsNodeItem extends Omit<SeniorityRecordSummary, "publishedDate"> {
  publishedStamp: number;
}

export interface DbSeniorityDataNodeItem {
  [key: string]: PilotRecord;
}
export interface DbSeniorityListsNode {
  [key: string]: DbSeniorityListsNodeItem;
}

export interface DbSeniorityDataNode {
  [key: string]: DbSeniorityDataNodeItem;
}