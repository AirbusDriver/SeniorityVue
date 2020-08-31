import { PilotRecord } from '@/seniority/types';


export enum FilterStatus {
  ACTIVE_ON = "ACTIVE_ON",
  ACTIVE_PUBLISHED = "ACTIVE_PUBLISHED",
  RETIRED_ON = "RETIRED_ON",
}
export type TableItem = PilotRecord & {
  retireDateString: string;
};

export type ItemFilter = (item: TableItem) => boolean;

export type ItemMapper<T> = (rec: T) => TableItem;

export type PilotRecordMapper = ItemMapper<PilotRecord>;