export const mutations = {
  select: (state, {id, type}) => {
    state.id = id;
    state.type = type;
  }
};
export const initialState = {
  id: '-1',
  type: 'location'
};
export default {state: initialState, mutations, namespaced: true};
