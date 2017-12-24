/* eslint-disable no-console*/
import debug from 'debug';
debug.disable('store:*');
import transitModes from '@/assets/transit-modes.json';
import {assert} from 'chai';
import Vue from 'vue';
const set = Vue.set;
// import db from '@/db.js';
// utilities
const essentialAttrs = ['to', 'from', 'byOrAt', 'time', 'mode'];
const makeId = ({to, from, byOrAt, time, mode}) => {
  return `${from}-[${mode}]->${to} ${byOrAt} ${time}`;
};
// TODO: gather to some utils module.
export const roundTime = (date) => {
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  return new Date(year, month, day, hours, minutes);
};
/**
 * [Commute description]
 */
export class Commute {
  /**
   * Enusre a valid commute;
   * @param {Object} obj
   */
  constructor(obj) {
    assert.isObject(obj);
    let {id, to, from, mode, time, byOrAt, frequency, notes, duration} = obj;
    if (mode !== undefined) {
      assert(
        transitModes.some((allowed) => allowed == mode),
        `mode ${mode} invalid`
      );
    }
    if (byOrAt !== undefined) {
      assert(
        byOrAt == 'arrive_by' || byOrAt == 'depart_at',
        `${byOrAt} is invalid; should be arrive_by or depart_at`
      );
    }
    if (time !== undefined) {
      assert.isNotNaN(new Date(time).getDate(), `invalid date/time ${time}`);
      time = roundTime(new Date(time));
    }
    if (!id) {
      // to, from validated in store actions
      essentialAttrs.forEach((attr) => assert(attr in obj, attr + ` missing`));
      id = makeId(obj);
    }
    if (frequency !== undefined) {
      assert.isNumber(frequency, `invalid frequency ${frequency}`);
      assert(frequency > 0, `invalid frequency ${frequency}: must be > 0`);
    }
    if (notes) assert.isString(notes, 'non-str note ${note}');
    let props = {id, to, from, mode, time, byOrAt, frequency, notes, duration};
    props = Object.entries(props)
      .filter(([key, value])=>value !== undefined)
      .reduce((acc, [key, value]) => Object.assign(acc, {[key]: value}), {});
    Object.assign(this, props);
  }
}

const check = {
  // hashable(payload) {
  // return ['to', 'from', 'byOrAt', 'time', 'mode'].every((e) => e in payload);
  // },
  // modeAllowed({mode}) {
  //   let allowed = transitModes.some();
  //   if (!allowed) debug('store:commutes')('invalid transit mode: ' + mode);
  //   return allowed;
  // },
  endpointExists(rootState, endpoint) {
    return (rootState.locations[endpoint] || {}).included;
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

export const columns = [
  'from', 'to', 'byOrAt', 'time', 'duration',
  'frequency', 'mode'
];

// mutations


export const mutations = {
  add(commutes, payload) {
    let commute = new Commute(payload);
    if (commutes[commute.id]) {
      console.warn('id already present', payload);
    } else {
      set(commutes, commute.id, {...commute});
    }
    set(commutes[commute.id], 'included', true);
  },
  update(commutes, payload) {
    let update = new Commute(payload);
    let prev = commutes[update.id];
    assert.ok(prev, `no commute found with ${update.id}`);
    if (prev) {
      set(commutes, update.id, {...prev, ...update});
    } else {
      console.warn('No such commute', update);
    }
  },
  remove(commutes, {id}) {
    if (commutes[id]) set(commutes[id], 'included', false);
  }
};

const setOfEssentialAttrs = new Set(essentialAttrs);
export const actions = {
  startup({state}) {
    // TODO: add
  },
  add({commit, rootState}, payload) {
    if (check.toAndFomExist(rootState, payload)) {
      commit('add', payload);
    } else {
      debug('store:commutes')('to/from not valid', payload);
    }
  },
  update({state, commit, dispatch}, payload) {
    let commute = new Commute(payload);
    let prev = state[commute.id];
    assert.ok(prev, `no commute with id ${commute.id} found`);
    const isUnchanged = (attr) => commute[attr] === prev[attr];
    const importantDiff = Object.keys(commute)
      .filter((key) => setOfEssentialAttrs.has(key));
    if (importantDiff.every(isUnchanged)) {
      commit('update', commute);
    } else {
      dispatch('clone', commute);
      commit('remove', prev);
    }
  },
  clone({state, dispatch}, payload) {
    let commute = new Commute(payload);
    let prev = state[commute.id];
    assert.ok(prev, `no commute with ${commute.id} found`);
    prev = {...state[commute.id]};
    delete commute.id;
    delete prev.id;
    let clone = new Commute({...prev, ...commute});
    delete clone.duration; // when mode/time/byOrAt change, duration changes.
    dispatch('add', clone);
  }
};

export const getters = {
  included(state, _, __, rootGetters) {
    let locationsIncluded = rootGetters['locations/included'];
    return Object.entries(state)
      .filter(([id, commute]) => {
        return commute.included
          && locationsIncluded[commute.from]
          && locationsIncluded[commute.to];
      })
      .reduce((acc, [id, commute]) => Object.assign(acc, {[id]: commute}), {});
  }
};

// let state = localStorage.getItem('commutes') || initialState;
export default {
  mutations, actions, getters, state: {}, namespaced: true
};
