/* eslint-disable no-console*/
import debug from 'debug';
debug.disable('store:*');
import transitModes from '@/assets/transit-modes.json';
// utilities
const check = {
  hashable(payload) {
    return ['to', 'from', 'byOrAt', 'time', 'mode'].every((e) => payload[e]);
  },
  modeAllowed({mode}) {
    let allowed = transitModes.some((allowed) => allowed == mode);
    if (!allowed) debug('store:commutes')('invalid transit mode: ' + mode);
    return allowed;
  },
  endpointExists(rootState, endpoint) {
    return rootState.locations.included[endpoint];
  },
  toAndFomExist(rootState, {to, from}) {
    // let included = rootState.locations.included;
    if (!check.endpointExists(rootState, to)) {
      debug('store:commutes')(to, 'is not an included location');
      return false;
    }
    if (!check.endpointExists(rootState, from)) {
      debug('store:commutes')(from, 'is not an included location');
      return false;
    }
    return true;
  }
};
const hash = ({to, from, byOrAt, time, mode}) => {
  // from = from.slice(0,8);
  // to = to.slice(0,8);
  return `${from}-[${mode}]->${to} ${byOrAt || '???'} ${time}`;
};
// const assign = (state, payload, name) => {
//   state.byId[payload.id][name] = payload[name];
// };
export const columns = [
  'from', 'to', 'byOrAt', 'time', 'duration',
  'frequency', 'mode'
];
// mutations

const add = (commutes, payload) => {
  if (check.hashable(payload)) {
    payload.id = hash(payload);
    if (commutes.byId[payload.id]) {
      console.warn('id already present', payload);
      commutes.included[payload.id] = true;
    } else {
      commutes.included[payload.id] = true;
      commutes.byId[payload.id] = payload;
    }
  }
};

export const mutations = {
  addCommute: add,
  updateCommuteFrequency(commutes, {id, frequency}) {
    if (Number.isFinite(frequency) && state.byId[id]) {
      commutes.byId[id].frequency = frequency;
    } else {
      console.warn('invalid frequency updata', frequency);
    }
  },
  updateCommuteDuration(commutes, {id, duration}) {
    if (Number.isFinite(duration) && commutes.byId[id]) {
      commutes.byId[id].duration = duration;
    } else {
      console.warn('invalid duration updata', duration);
    }
  },
  removeCommute(commutes, {id}) {
    if (commutes.included[id]) commutes.included[id] = false;
  }
};
const clone = (name, context, payload) => {
  let {dispatch, state: commutes} = context;
  let {id} = payload;
  if (id in commutes.byId && payload[name] != commutes.byId[id][name]) {
    dispatch(
      'addCommute',
      Object.assign({}, commutes.byId[id], {[name]: payload[name]})
    );
  }
};
export const actions = {
  addCommute({commit, rootState}, payload) {
    // console.log(JSON.stringify(rootState, null, 2));
    if (check.toAndFomExist(rootState, payload) && check.modeAllowed(payload)) {
      commit('addCommute', payload);
    } else {
      debug('store:commutes')('payload not valid', payload);
    }
  },
  cloneByMode(context, payload) {
    if (check.modeAllowed(payload)) clone('mode', context, payload);
  },
  clone(context, payload) {
    clone(payload.by, context, payload);
  }
};

export const getters = {
  includedCommutes(state, unusedLocalGetters, rootState) {
    // console.log(rootState.locations.state);
    let locationsIncluded = rootState.locations.included;
    return new Set(
      Object.keys(state.byId)
        .filter((id) => {
          return state.included[id]
            && locationsIncluded[state.byId[id].from]
            && locationsIncluded[state.byId[id].to];
        })
    );
  }
};

// check dexie db first
export const initialState = {
  included: {}, byId: {}
};
let state = localStorage.getItem('commutes') || initialState;
export default {state, mutations, actions, getters, namespaced: true};
