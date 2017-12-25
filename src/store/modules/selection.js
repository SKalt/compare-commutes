export const mutations = {
  select: (state, {id, type}) => {
    state.id = id;
    state.type = type;
  }
};
export const initialState = {
  id: null,
  type: null
};
export const getters = {
  selected({id, type}, _, rootState, rootGetters ) {
    let selected = rootState[type == 'commute' ? 'commutes' : 'locations'][id];
    if (selected) {
      return {...selected, type};
    } else {
      return {};
    }
  }
};
export default {state: initialState, getters, mutations, namespaced: true};
