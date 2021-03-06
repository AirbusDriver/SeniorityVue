import { GetterTree } from 'vuex';
import { RootState } from '../index';
import { SeniorityState } from './types';
import { SeniorityRecord } from '@/seniority/types';
import { cloneDeep, sortBy } from 'lodash';

// todo: Make an enum

export const getters: GetterTree<SeniorityState, RootState> = {
  allRecords(state): SeniorityRecord[] {
    return cloneDeep(state.records);
  },
  mostRecentRecord(state, getters): SeniorityRecord | null {
    const records = getters.recordsByPublishedDate;
    return records.length > 0 ? records[records.length - 1] : null
  },
  recordsByPublishedDate(state, getters): SeniorityRecord[] {
    const records: SeniorityRecord[] = getters.allRecords;
    if (records.length === 0) {
      return [];
    }
    const sorter: (a: SeniorityRecord, b: SeniorityRecord) => -1 | 0 | 1 = (a, b) => {
      return a.publishedDate === b.publishedDate ? 0 : a.publishedDate < b.publishedDate ? -1 : 1;
    }
    return records.sort(sorter);
  }
}