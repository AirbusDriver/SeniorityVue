import { PilotRecord } from '@/seniority/types';


export type TableItem = PilotRecord & {
  retireDateString: string;
};

export type ItemFilter = (item: TableItem) => boolean;

export type ItemMapper<T> = (rec: T) => TableItem;

export type PilotRecordMapper = ItemMapper<PilotRecord>;