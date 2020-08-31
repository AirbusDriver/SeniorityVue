export type Base = {
  code: string;
  city?: string;
}

export type FleetType = {
  code: string;
  name?: string;
}

export type BaseInfo = Base[];

export type FleetInfo = FleetType[];

export type EmployeeID = string | number;

export interface AirlineInfo {
  bases: BaseInfo;
  fleet: FleetInfo;
  name: string;
}

export enum Seat {
  CA = 'CA',
  FO = 'FO',
}

export interface PilotRecord {
  employeeID: EmployeeID;
  seniorityNumber: number;
  base: string;
  retireDate: Date;
  seat: Seat;
  fleet: string;
}

export type SeniorityRecordSummary = {
  id: string;
  publishedDate: Date;
  recordCount: number;
}

export interface SeniorityRecord extends SeniorityRecordSummary {
  records: PilotRecord[];
}

export interface BaseSeniorityService {
  getAllSeniorityRecordSummaries(): Promise<SeniorityRecordSummary[]>;
}

export type PilotRecordReducer = (records: PilotRecord[]) => PilotRecord[];

export enum ActiveFilterStatus {
  ACTIVE = "ACTIVE",
  RETIRED = "RETIRED",
}

export type ActiveFilterOptions = {
  status: ActiveFilterStatus;
  value?: Date;
}

export interface FilterBuilderOptions {
  activeFilter?: ActiveFilterOptions;

  baseFilter?: {
    value: string;
  };

  seatFilter?: {
    value: Seat;
  };

  fleetFilter?: {
    value: string;
  };
}