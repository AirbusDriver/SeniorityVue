import { GetterTree } from 'vuex';
import { RootState } from '../index';
import { SeniorityState, SeniorityGetterTypes } from './types';
import { SeniorityRecord, SeniorityRecordSummary } from '@/seniority/types';
import { cloneDeep } from 'lodash';


const { ALL_RECORDS, ALL_RECORD_SUMMARIES, HAS_RECORDS, MOST_RECENT_RECORD, RECORDS_BY_PUBLISHED_DATE, GET_RECORD_FOR_ID } = SeniorityGetterTypes;


export const getters: GetterTree<SeniorityState, RootState> = {
  [ALL_RECORDS](state): SeniorityRecord[] {
    return cloneDeep(state.records);
  },
  [HAS_RECORDS](state): boolean {
    return state.records.length > 0;
  },
  [MOST_RECENT_RECORD](state, getters): SeniorityRecord | null {
    const records = getters[RECORDS_BY_PUBLISHED_DATE];
    return records.length > 0 ? records[records.length - 1] : null
  },
  [RECORDS_BY_PUBLISHED_DATE](state, getters): SeniorityRecord[] {
    const records: SeniorityRecord[] = getters[ALL_RECORDS];
    if (records.length === 0) {
      return [];
    }
    const sorter: (a: SeniorityRecord, b: SeniorityRecord) => -1 | 0 | 1 = (a, b) => {
      return a.publishedDate === b.publishedDate ? 0 : a.publishedDate < b.publishedDate ? -1 : 1;
    }
    return records.sort(sorter);
  },
  [ALL_RECORD_SUMMARIES](state, getters): SeniorityRecordSummary[] {
    const records: SeniorityRecord[] = getters[RECORDS_BY_PUBLISHED_DATE];
    return records.reduce((acc: SeniorityRecordSummary[], rec): SeniorityRecordSummary[] => {
      const { id, publishedDate, recordCount } = rec;
      return [...acc, {
        id, publishedDate, recordCount
      }]
    }, [])
  },
  [GET_RECORD_FOR_ID](state, getters): (id: string) => SeniorityRecord | undefined {
    return id => {
      const record = getters[ALL_RECORDS].find((rec: SeniorityRecord) => rec.id === id);
      return record;
    }
  }
}