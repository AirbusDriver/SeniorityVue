import { ActionTree } from 'vuex';
import { SeniorityState, SeniorityActionTypes, SeniorityMutationTypes as mutations } from './types';
import { RootState } from '../index';
import { SeniorityRecord } from '@/seniority/types';
import { localService } from '@/seniority'

const { ADD_SENIORITY_RECORD, LOAD_SENIORITY_RECORDS } = SeniorityActionTypes;

const service = localService();

export const actions: ActionTree<SeniorityState, RootState> = {
  [ADD_SENIORITY_RECORD]({ commit }, payload: SeniorityRecord) {
    commit(mutations.ADD_SENIORITY_RECORD, payload);
  },
  async [LOAD_SENIORITY_RECORDS]({ dispatch }) {
    console.debug('fetching records');
    const records = await service.getAllSeniorityRecords();
    console.debug('records fetched', records);
    records.forEach(record => {
      dispatch(ADD_SENIORITY_RECORD, { record });
    });
  }
}
