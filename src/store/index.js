import Vue from 'vue';
import Vuex from 'vuex';
import filter from './modules/filter';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    filter,
  },
});

export default store;