import { ActionTree } from 'vuex';
import { SeniorityState, SeniorityActionTypes, SeniorityMutationTypes as mutations, DbSeniorityListsNodeItem, DbSeniorityListsNode, DbSeniorityDataNode, DbSeniorityDataNodeItem } from './types';
import { RootState } from '../index';
import { SeniorityRecord } from '@/seniority/types';
import { getCurrentSeniorityRecords } from './firebaseRequests';
const { ADD_SENIORITY_RECORD, LOAD_SENIORITY_RECORDS } = SeniorityActionTypes;



export const actions: ActionTree<SeniorityState, RootState> = {
  [ADD_SENIORITY_RECORD]({ commit }, payload: SeniorityRecord) {
    commit(mutations.ADD_SENIORITY_RECORD, payload);
  },
  async [LOAD_SENIORITY_RECORDS]({ dispatch }) {
    const records = await getCurrentSeniorityRecords();

    records.forEach(rec => {
      dispatch(ADD_SENIORITY_RECORD, { record: rec });
      console.log(`adding record: `, rec)
    })
  }
}
