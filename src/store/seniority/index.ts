import { Module } from 'vuex';
import { RootState } from '../index';
import { mutations } from './mutations'
import { actions } from './actions';
import { state } from './state';
import { getters } from './getters';
import { SeniorityState } from './types';

export * from './types';

export const seniority: Module<SeniorityState, RootState> = {
  namespaced: true,
  actions,
  state,
  mutations,
  getters,
}