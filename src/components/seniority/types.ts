import { PilotRecord } from '@/seniority/types';


export enum FilterStatus {
  ACTIVE_ON = "ACTIVE_ON",
}
export type TableItem = PilotRecord & {
  retireDateString: string;
};


export type ItemMapper<T> = (rec: T) => TableItem;

export type PilotRecordMapper = ItemMapper<PilotRecord>;