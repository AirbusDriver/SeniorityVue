export interface PilotRecord {
  employeeID: string | number;
  seniorityNumber: number;
  base: string;
  retireDate: string;
  retireStamp: number;
  seat: string;
  fleet: string;
}

export interface SeniorityData {
  seniorityListID: string;
  pilotData: PilotRecord[];
}

export interface SeniorityList {
  id: string;
  publishedDate: string;
  publishedStamp: number;
  recordCount: number;
}

export interface DbRecord<T> { [key: string]: T }

export type DbSeniorityDataNodes = DbRecord<SeniorityData>;

export type DbSeniorityListNodes = DbRecord<SeniorityList>;

export interface DbData {
  seniorityLists: DbSeniorityListNodes;
  seniorityData: DbSeniorityDataNodes;
}