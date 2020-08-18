import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { seniority } from './seniority';

Vue.use(Vuex)

export interface RootState {
  version: string;
}

const state: RootState = {
  version: "0.0.1"
};

const store: StoreOptions<RootState> = {
  state: () => state,
  modules: {
    seniority
  }
}


export default new Vuex.Store<RootState>(store);
