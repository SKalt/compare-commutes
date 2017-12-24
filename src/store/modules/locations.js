import polyline from 'polyline';
import Vue from 'vue';
import debug from 'debug';
import {assert} from 'chai';
import db from '@/db.js';
debug.enable('store:*');
const log = debug('store:locations');
const set = Vue.set;
const isUndefined = (x) => x === undefined;

/**
 * ORM helper to represent a location.
 */
export class Location {
  /**
   * Data cleaning on
   * @param  {Object} obj [description]
   */
  constructor(obj) {
    let {address, notes, alias, id, lat, lng, isOrigin, coords} = obj;
    if (id === undefined || id === null) {
      if ([lat, lng].some((x) => x === undefined || x === null)) {
        if (coords) {
          [lat, lng] = coords;
        }
      }
      assert(
        !isUndefined(lat) && lat.constructor === Number,
        `invalid lat: ${lat}`
      );
      assert(
        lng !== undefined && lng.constructor === Number,
        `invalid lng: ${lng}`
      );
      id = id || polyline.encode([[lat, lng]]);
      assert(id !== undefined && id !== null, 'no id found');
    }
    let props = {id, address, notes, alias, lat, lng, isOrigin};
    props = Object.entries(props)
      .filter(([key, value]) => value !== undefined)
      .reduce((acc, [key, value]) => Object.assign(acc, {[key]: value}), {});
    Object.assign(this, props);
  }
  /**
   * Create Location(s) from geojson feature(s)
   * @param  {Feature|FeatureCollection} geojson
   * @return {Location|Location[]}
   */
  fromGeoJson(geojson) {
    let {type} = geojson;
    if (geojson.type == 'Feature') {
      assert(
        geojson.geometry.type == 'Point',
        `unexpected geometry: ${geojson.geometry.type}`
      );
      let [lat, lng] = geojson.geometry.coordinates;
      return new Location({...feature.properties, ...feature, lat, lng});
    } else if (type == 'FeatureCollection') {
      return geojson.features.map((f) => this.fromGeoJson(f));
    }
  }
}

export const mutations = {
  /**
   * Add a new location to the store
   * @param {Object} state
   * @param {Object} payload a location
   */
  add(state, payload) {
    assert(payload, `Falsy location: ${payload}`);
    const loc = new Location(payload);
    if (!(loc.id in state)) {
      set(state, loc.id, {...loc, included: true});
    } else {
      log(`${loc.id} already present`, loc);
      set(state[loc.id], 'included', true);
    }
  },
  remove(state, payload) {
    const loc = new Location(payload);
    if (loc.id in state) set(state[loc.id], 'included', false);
  },
  update(state, payload) {
    let update = new Location(payload);
    if (update.id in state) {
      update = {...state[update.id], ...update, included: true};
      set(state, update.id, update);
    } else {
      console.warn(`${update} matches no location and so was not updated`);
    }
  }
};

export const getters = {
  included(state) {
    return Object.entries(state)
      .filter(([id, loc]) => loc.included)
      .reduce((acc, [id, loc]) => Object.assign(acc, {[id]: loc}), {});
  },
  origins(state, getters) {
    return Object.values(getters.included).filter((loc) => loc.isOrigin);
  },
  destinations(state, getters) {
    return Object.values(getters.included).filter((loc) => !loc.isOrigin);
  }
};

export const actions = {
  async startup({state}) {
    const arr = await db.locations.toArray();
    const byId = arr.reduce((acc, row) => Object.assign(acc, row), {});
    const included = arr
      .map(({id, included}) =>({[id]: included}))
      .reduce((acc, r) => Object.assing(acc, r), {});
    set(state, 'byId', byId);
    set(state, 'included', included);
    return true;
  }
};

export const columns = [
  'id', 'address', 'isOrigin', 'notes', 'alias', /* 'coords',*/ 'lat', 'lng'
];
export default {mutations, state: {}, getters, actions, namespaced: true};
