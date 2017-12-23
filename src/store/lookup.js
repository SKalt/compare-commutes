import {lineString, point} from '@turf/helpers';

function lookup( keys, _state, id) {
  return keys
    .map((key) => ({[key]: _state[key][id]}))
    .reduce(Object.assign, {id});
}
export function commuteGeometry(_state, id) {
  let coords = [
    _state.locations.coords[_state.commutes[id].from],
    _state.locations.coords[_state.commutes[id].to]
  ];
  return lineString(coords);
}

export function commute(_state, id) {
  return lookup(
    [
      'to', 'from', 'mode', 'distance', 'byOrAt', 'duration',
      'frequency', 'time'
    ],
    id, _state);
}

export function locationGeometry(_state, id) {
  return point(_state.coords[id]);
}
