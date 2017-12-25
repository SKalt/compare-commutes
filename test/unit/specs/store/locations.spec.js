import {
  mutations, getters, actions, Location
} from '@/store/modules/locations';
import Vuex from 'vuex';
import {assert, AssertionError} from 'chai';
const makeStore = () => new Vuex.Store({
  mutations, getters, actions, state: {}
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
  const makePreppedStore = () => {
    let store = makeStore();
    store.commit('add', {coords: [0, 0], notes: 'notes'});
    return store;
  };
  describe('mutations', ()=>{
    describe('adds a location', ()=>{
      const checkAllKeys = (obj) => {
        Object.keys(obj).forEach(
          (key) => assert.equal(
            obj[key],
            {lat: 0, lng: 0, id: '??', included: true}[key],
            key + ' mismatched'
          )
        );
      };
      it('avoids duplicating locations', ()=>{
        let store = makeStore();
        assert.isObject(store.state);
        store.commit('add', {lat: 0, lng: 0, id: 'foo'});
        store.commit('add', {coords: [0, 0], id: 'foo'});
        assert.deepEqual(store.state['??'].included, true, 'id not included');
        checkAllKeys(store.state['??']);
        assert.deepEqual(Object.keys(store.state), ['??'], 'unexpected ids');
      });
    });
    describe('updates a location', ()=>{
      it(' \'s notes successfully', ()=>{
        const store = makePreppedStore();
        store.commit('update', {id: '??', notes: 'foo'});
        assert.equal(store.state['??'].notes, 'foo', 'didn\'t update');
      });
      it(' \'s alias successfully', ()=>{
        const store = makePreppedStore();
        store.commit('update', {id: '??', alias: 'foo'});
        assert.equal(store.state['??'].alias, 'foo', 'didn\'t update');
      });
    });
    describe('removing a location', ()=>{
      it('removes the inclusion but not the byId entry', ()=>{
        const store = makePreppedStore();
        store.commit('remove', {id: '??'});
        assert.equal(store.state['??'].notes, 'notes', 'deleted byId entry');
        assert.isFalse(store.state['??'].included, 'inclusion not removed');
      });
    });
  });
  describe('getters', ()=>{
    it('included', ()=>{
      const store = makePreppedStore();
      assert.deepEqual(
        Object.keys(store.getters.included), ['??'], 'unexpected keys'
      );
      assert.ok(store.getters.included['??'], 'wrong id');
      store.commit('remove', {id: '??'});
      assert.deepEqual(
        Object.keys(store.getters.included), [], 'unexpected keys'
      );
    });
    it('origins', ()=>{
      const store = makePreppedStore();
      console.log([...store.getters.origins]);
      assert.lengthOf(store.getters.origins, 0, 'unexpected `origins ` len');
      store.commit('update', {id: '??', isOrigin: true});
      assert.lengthOf(store.getters.origins, 1, 'unexpected `origins ` len');
      assert.equal(store.getters.origins[0].id, '??', 'wrong id');
    });
    it('destinations', ()=>{
      const store = makePreppedStore();
      console.log([...store.getters.destinations]);
      assert.lengthOf(store.getters.destinations, 1, 'unexpected length');
      assert.equal(store.getters.destinations[0].id, '??', 'wrong id');
      store.commit('update', {id: '??', isOrigin: true});
      assert.lengthOf(store.getters.destinations, 0, 'unexpected length');
    });
  });
  // TODO: adapt mutaiton tests for action testing.
  // describe('actions', ()=>{
  //   it('from just coordinates', ()=>{
  //     let store = makeStore();
  //     assert.isObject(store.state);
  //     store.dispatch('add', {coords: [0, 0]});
  //     assert.deepEqual(store.state['??'].included, true, 'id not included');
  //     Object.keys(store.state['??']).forEach(
  //       (key) => assert.equal(
  //         store.state['??'][key],
  //         {lat: 0, lng: 0, id: '??', included: true}[key],
  //         key + ' mismatched'
  //       )
  //     );
  //   });
  //   it('from lat/lng', ()=>{
  //     let store = makeStore();
  //     assert.isObject(store.state);
  //     store.commit('add', {lat: 0, lng: 0});
  //     assert.deepEqual(store.state['??'].included, true, 'id not included');
  //     checkAllKeys(store.state['??']);
  //   });
  //
  // })
});
