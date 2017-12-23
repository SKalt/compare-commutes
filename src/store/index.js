import Vue from 'vue';
import Vuex from 'vuex';
import locations from './modules/locations.js';
import commutes from './modules/commutes.js';
import selection from './modules/selection.js';
import map from './modules/map.js';
import syncToDb from './plugins/syncToDb.js';
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {locations, commutes, map, selection},
  plugins: [syncToDb]
});
