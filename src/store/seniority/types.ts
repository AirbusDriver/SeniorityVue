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

export interface DbSeniorityListsNodeItem {
  publishedStamp: number;
  id: string;
  recordCount: number;
  publishedDate: string;
}

export interface DbPilotRecordNode {
  employeeID: string;
  base: string;
  fleet: string;
  retireDate: string;
  seat: string;
  seniorityNumber: number;
}

export interface DbSeniorityDataNodeItem {
  [key: string]: DbPilotRecordNode;
}
export interface DbSeniorityListsNode {
  [key: string]: DbSeniorityListsNodeItem;
}

export interface DbSeniorityDataNode {
  [key: string]: DbSeniorityDataNodeItem;
}