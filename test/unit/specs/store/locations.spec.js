import {
  mutations, getters, actions, Location
} from '@/store/modules/locations';
import Vuex from 'vuex';
import {assert, AssertionError} from 'chai';
const makeStore = () => new Vuex.Store({
  mutations, getters, actions, state: {byId: {}, included: {}}
});
describe('Location class', ()=>{
  describe('initializes', ()=>{
    // with full input
    let makeExampleWithout = (...masked) => {
      let example = {
        id: 'id', address: 'address', alias: 'alias', isOrigin: false,
        notes: 'notes', lat: 0, lng: 0, coords: [1, 1]
      };
      masked.forEach((mask) => delete example[mask]);
      return example;
    };
    let check = (loc, prop) => assert.equal(
      loc[prop], prop, `unexpected ${prop}: ${loc[prop]}`
    );
    it('with full input', ()=>{
      let loc = new Location(makeExampleWithout());
      console.log(loc);
      check(loc, 'id');
      check(loc, 'address');
      check(loc, 'alias');
      check(loc, 'notes');
      assert.equal(loc.isOrigin, false, `unexpectedly an origin`);
      assert.equal(loc.lat, 0, `unexpected lat: ${loc.lat}`);
      assert.equal(loc.lng, 0, `unexpected lng: ${loc.lng}`);
    });
    // it('with no id, but alias, coords, and address', ()=>{
    //   let loc = new Location(example);
    //   assert.equal(loc.id, 'alias', `unexpected id [1]: ${loc.id}`);
    // });
    // // remove features to test id composition.
    // it('with neither id nor alias', ()=>{
    //   let loc = new Location(example);
    //   assert.equal(loc.id, 'address', `unexpected id [2]: ${loc.id}`);
    // });
    it('from lat/lng', ()=>{
      const example = makeExampleWithout('id');
      let loc = new Location(example);
      assert.equal(loc.id, '??', `unexpected id [3]: ${loc.id}`);
    });
    it('from coords', ()=>{
      const example = makeExampleWithout('id', 'lng');
      let loc = new Location(example);
      assert.equal(loc.lat, 1, `unexpected lat [1]: ${loc.lat}`);
      assert.equal(loc.lng, 1, `unexpected lng [1]: ${loc.lng}`);
      assert.equal(loc.id, '_ibE_ibE', `unexpected id [4]: ${loc.id}`);
    });
    it('with only an id', ()=>{
      const example = {id: 'id', notes: 'notes'};
      let loc = new Location(example);
      check(loc, 'id');
      check(loc, 'notes');
    });
  });

  it('rejects invalid input', ()=>{
    let example = {
      /* id, alias, address, lat, lng, coords,*/
      notes: 'notes'
    };
    assert.throws(()=> new Location(example), AssertionError);
    // new Location(example);
  });
});
describe('Location store', ()=>{
  describe('adds a location', ()=>{
    it('from just coordinates', ()=>{
      let store = makeStore();
      console.log(store.state);
      assert.isObject(store.state);
      store.commit('add', {coords: [0, 0]});
      assert.deepEqual(store.state.included, {'??': true}, 'id not included');
      assert.ok(store.state.byId['??']);
      Object.keys(store.state.byId['??']).forEach(
        (key) => assert.equal(
          store.state.byId['??'][key],
          {lat: 0, lng: 0, id: '??'}[key],
          key + ' mismatched'
        )
      );
    });
    it('from lat/lng', ()=>{
      let store = makeStore();
      console.log(store.state);
      assert.isObject(store.state);
      store.commit('add', {lat: 0, lng: 0});
      assert.deepEqual(store.state.included, {'??': true}, 'id not included');
      assert.ok(store.state.byId['??']);
      Object.keys(store.state.byId['??']).forEach(
        (key) => assert.equal(
          store.state.byId['??'][key],
          {lat: 0, lng: 0, id: '??'}[key],
          key + ' mismatched'
        )
      );
    });
    it('avoids duplicating locations', ()=>{
      let store = makeStore();
      console.log(store.state);
      assert.isObject(store.state);
      store.commit('add', {lat: 0, lng: 0});
      store.commit('add', {coords: [0, 0]});
      assert.deepEqual(store.state.included, {'??': true}, 'id not included');
      assert.ok(store.state.byId['??']);
      Object.keys(store.state.byId['??']).forEach(
        (key) => assert.equal(
          store.state.byId['??'][key],
          {lat: 0, lng: 0, id: '??'}[key],
          key + ' mismatched'
        )
      );
      assert.deepEqual(Object.keys(store.state.byId), ['??'], 'unexpected ids');
    });
  });
  const makePreppedStore = () => {
    let store = makeStore();
    store.commit('add', {coords: [0, 0], notes: 'notes'});
    return store;
  };
  describe('updates a location', ()=>{
    it(' \'s notes successfully', ()=>{
      const store = makePreppedStore();
      store.commit('update', {id: '??', notes: 'foo'});
      assert.equal(store.state.byId['??'].notes, 'foo', 'didn\'t update');
    });
    it(' \'s alias successfully', ()=>{
      const store = makePreppedStore();
      store.commit('update', {id: '??', alias: 'foo'});
      assert.equal(store.state.byId['??'].alias, 'foo', 'didn\'t update');
    });
  });
  describe('removing a location', ()=>{
    it('removes the inclusion but not the byId entry', ()=>{
      const store = makePreppedStore();
      store.commit('remove', {id: '??'});
      assert.equal(store.state.byId['??'].notes, 'notes', 'deleted byId entry');
      assert.isFalse(store.state.included['??'], 'inclusion not removed');
    });
  });
});
