import Vue from 'vue';
import { Wrapper } from '@vue/test-utils';
import SeniorityExplorerController from "@/components/seniority/SeniorityExplorerController.vue";
import { createWrapper } from '../../utils';

const getPickerValue = (wrapper: any): string | null => (wrapper.vm.$refs['picker-output'] as any).value

describe("SeniorityExplorerController", () => {

  const RealDate = Date.now;

  beforeAll(() => {
    global.Date.now = jest.fn(() => new Date(2020, 6, 4).valueOf())
  })

  afterAll(() => {
    global.Date.now = RealDate;
  })

  describe("when not given a 'publishedDate' prop", () => {
    const wrapper = createWrapper(SeniorityExplorerController, {});

    it('the active-today-btn is disabled', () => {
      expect(wrapper.find('#active-today-btn').attributes('disabled')).toBe("disabled");
    });

    it('the active-published-btn is disabled', () => {
      expect(wrapper.find('#active-published-btn').attributes('disabled')).toBe("disabled");
    });

    test('the pickerValue shows current date', async () => {
      await Vue.nextTick();
      const val = getPickerValue(wrapper);

      expect(val).toMatch(`${(new Date()).toISOString().substr(0, 10)}`);
    });
  });

  describe("when given a publishedDate prop", () => {
    const testPublishedDate = new Date(2020, 6, 4)
    const wrapper = createWrapper(SeniorityExplorerController, {
      propsData: {
        publishedDate: testPublishedDate
      }
    });

    it(`it sets the picker date to the published date`, () => {
      const val = getPickerValue(wrapper);
      expect(val).toBe('2020-07-04');
    })

    it(`the 'active-today-btn button' is not disabled`, () => {
      const button = wrapper.find('#active-today-btn');

      expect(button.attributes('disabled')).toBeUndefined();
    });

    it(`the 'active-published-btn' button should be disabled`, () => {
      const button = wrapper.find('#active-published-btn');

      expect(button.attributes('disabled')).toBeTruthy();
    })
  });

});