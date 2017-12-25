// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import debug from 'debug';
import store from './store/index.js';
if (process.env.NODE_ENV != 'production') {
  debug.disable('*');
  debug.enable('app:*');
  window.store = store;
  // window.map = map;
  // window.events = events;
} else {
  debug.disable();
}

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
});
