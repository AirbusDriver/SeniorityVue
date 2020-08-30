import { createWrapper } from '../../utils';
import Vuex from 'vuex';
import { SeniorityGetterTypes } from '@/store/seniority/types';
import SeniorityStatistics from '@/components/seniority/SeniorityStatistics.vue';

const mockGetter = jest.fn(() => "mockedObject");
const mockGetForId = jest.fn((id) => mockGetter);

const storeFactory = () => new Vuex.Store({
  modules: {
    seniority: {
      namespaced: true,
      getters: {
        [SeniorityGetterTypes.GET_RECORD_FOR_ID]: mockGetForId
      }
    }
  }
});

const wrapper = createWrapper(SeniorityStatistics, { propsData: { recordId: "123" } }, false, storeFactory)

it('calls', () => {
  expect(mockGetter).toHaveBeenCalledWith("123");
});

it('sets selected record', () => {
  expect(wrapper.vm.$data.selectedRecord).toBe("mockedObject");
});