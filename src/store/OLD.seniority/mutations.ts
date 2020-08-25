import { MutationTree } from 'vuex';
import { SeniorityState, SeniorityMutationTypes } from './types';
import { SeniorityRecord } from '@/seniority/types';

const { ADD_SENIORITY_RECORD } = SeniorityMutationTypes;

export const mutations: MutationTree<SeniorityState> = {
  [ADD_SENIORITY_RECORD](state, payload: { record: SeniorityRecord }) {
    state.records = [...state.records, payload.record];
  }
}

