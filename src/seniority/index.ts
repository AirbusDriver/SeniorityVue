import { jetbluePilotFactory } from './factories';
import { LocalSeniorityService } from './service';
import { PilotRecord, SeniorityRecord } from './types';
import dummyData from "./dummyData.json";

let dummyRecords: PilotRecord[];

try {
  const parsedDates = dummyData.map(record => Object.assign({}, record, { retireDate: new Date(Date.parse(record.retireDate)) }));
  dummyRecords = parsedDates.map(record => jetbluePilotFactory.parseRecord(record));
} catch (error) {
  console.error(error);
  dummyRecords = [];
}

const dummySeniorityLists: SeniorityRecord[] = [{
  id: "1",
  publishedDate: new Date(2020, 0, 1),
  recordCount: dummyRecords.length,
  records: [...dummyRecords]
}]

export const localService = () => new LocalSeniorityService(dummySeniorityLists);


export * as errors from "./errors";
