import {lineString, point} from '@turf/helpers';
/**
 * Given an index of keys -> values, return the values for the given keys
 * @param  {id[]} keys   [description]
 * @param  {Object} _state [description]
 * @param  {[type]} id     [description]
 * @return {[type]}        [description]
 */
function lookup( keys, _state, id) {
  return keys
    .map((key) => ({[key]: _state[key][id]}))
    .reduce(Object.assign, {id});
}
/**
 * Get a geojson line from a commute
 * @param  {[type]} _state [description]
 * @param  {[type]} id     [description]
 * @return {[type]}        [description]
 */
export function commuteGeometry(_state, id) {
  let coords = [
    _state.locations.coords[_state.commutes[id].from],
    _state.locations.coords[_state.commutes[id].to]
  ];
  return lineString(coords);
}
/**
 * [commute description]
 * @param  {[type]} _state [description]
 * @param  {[type]} id     [description]
 * @return {[type]}        [description]
 */
export function commute(_state, id) {
  return lookup(
    [
      'to', 'from', 'mode', 'distance', 'byOrAt', 'duration',
      'frequency', 'time'
    ],
    id, _state);
}
/**
 * [locationGeometry description]
 * @param  {[type]} _state [description]
 * @param  {[type]} id     [description]
 * @return {[type]}        [description]
 */
export function locationGeometry(_state, id) {
  return point(_state.coords[id]);
}
