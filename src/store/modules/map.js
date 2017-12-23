export default {
  state: {mode: 'ADD_LOCATIONS'},
  mutations: {
    toggleMapMode(state) {
      if (state.mode == 'ADD_LOCATIONS') {
        state.mode = 'REMOVE_LOCATIONS';
      } else {
        state.mode = 'ADD_LOCATIONS';
      }
    },
    updateMapMode(state, {mode}) {
      if (state.mode != mode) state.mode = mode;
    }
  }
};
