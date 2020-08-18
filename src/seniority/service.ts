import { SeniorityRecord, BaseSeniorityService, SeniorityRecordSummary } from './types';
import { cloneDeep } from "lodash";


export class LocalSeniorityService implements BaseSeniorityService {
  private _records: SeniorityRecord[];

  constructor(data: SeniorityRecord[]) {
    this._records = cloneDeep(data);
  }

  get seniorityRecordSummaries(): SeniorityRecordSummary[] {
    try {
      return this._records.map((record) => {
        return {
          id: record.id,
          publishedDate: record.publishedDate,
          recordCount: record.records.length,
        }
      })
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  get records(): SeniorityRecord[] {
    return cloneDeep(this._records);
  }

  getAllSeniorityRecordSummaries() {
    return Promise.resolve(cloneDeep(this.seniorityRecordSummaries));
  }

  getAllSeniorityRecords() {
    return Promise.resolve(this.records);
  }
}

