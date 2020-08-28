import Vue, { VueConstructor } from 'vue';
import Vuetify from 'vuetify';
import Vuex, { Store, StoreOptions } from 'vuex';
import { mount, createLocalVue, shallowMount, MountOptions, ShallowMountOptions } from '@vue/test-utils';


Vue.use(Vuetify)

type StoreFactory = () => Store<any>;


export const createWrapper = <T extends Vue>(component: VueConstructor<T>, options: MountOptions<T> | ShallowMountOptions<T> = {}, shallow = false, storeFactory?: StoreFactory) => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const vuetify = new Vuetify()

  const store = typeof storeFactory === "function" ? storeFactory() : new Store({})

  const func = shallow ? shallowMount : mount;
  if (shallow) {
    const opts = options as ShallowMountOptions<T>;
    return func(component, {
      localVue,
      vuetify,
      store,
      ...opts
    })
  }
  const opts = options as MountOptions<T>;
  return func(component, {
    localVue,
    vuetify,
    store,
    ...opts
  })
};