import {
  /* mutations, getters, actions,*/ Commute, roundTime
} from '@/store/modules/commutes.js';
import commutes from '@/store/modules/commutes.js';
import {assert, AssertionError} from 'chai';
import locations from '@/store/modules/locations.js';
import {Store} from 'vuex';
import sinon from 'sinon';
const makeStore = () => {
  return new Store({
    modules: {
      locations: {...locations, state: {
        '??': {lat: 0, lng: 0, included: true},
        '_ibE_ibE': {lat: 1, lng: 1, included: true}
      }},
      commutes: {...commutes, state: {}}
    }
  });
};
const now = roundTime(new Date());
const checkAttrs = (commute, expectations) =>{
  const check = (attr, expected) => {
    assert.deepEqual(commute[attr], expected, `incorrect ${attr}`);
  };
  expectations.forEach((pair) => check(...pair));
};
const makeExample = () => {
  return {
    from: '??', to: '_ibE_ibE', time: now, byOrAt: 'arrive_by',
    mode: 'walking'
  };
};
const expectedId = `??-[walking]->_ibE_ibE arrive_by ${now}`;
// const makeExampleWithout = (...masked) => {
//   const example = makeExample();
//   masked.forEach((mask) => delete example[mask]);
//   return example;
// };
const makePreppedStore = ()=>{
  const store = makeStore();
  store.commit('commutes/add', makeExample());
  return store;
};
describe('Commute class', ()=>{
  describe('initialization', ()=>{
    it('with full input', ()=>{
      const example = makeExample();
      const commute = new Commute(example);
      checkAttrs(commute, [
        ['id', `??-[walking]->_ibE_ibE arrive_by ${now}`],
        ['from', '??'],
        ['to', '_ibE_ibE'],
        ['mode', 'walking'],
        ['byOrAt', 'arrive_by'],
        ['time', now]
      ]);
    });
    it('with later-stage vars', ()=>{
      const example = {...makeExample(), duration: 3, frequency: 2};
      const commute = new Commute(example);
      checkAttrs(commute, [
        ['id', `??-[walking]->_ibE_ibE arrive_by ${now}`],
        ['from', '??'],
        ['to', '_ibE_ibE'],
        ['mode', 'walking'],
        ['byOrAt', 'arrive_by'],
        ['time', now],
        ['frequency', 2],
        ['duration', 3]
      ]);
    });
    it('rejects input with incorrect `mode`', ()=>{
      assert.throws(
        () => new Commute({...makeExample(), mode: 'bad'}),
        AssertionError
      );
      assert.throws(
        () => new Commute({...makeExample(), mode: null}),
        AssertionError
      );
      const example = makeExample();
      delete example.mode;
      assert.throws(
        () => new Commute(example),
        AssertionError
      );
    });
    it('rejects input with incorrect `time`', () => {
      assert.throws(
        () => new Commute({...makeExample(), time: 'bad'}),
        AssertionError
      );
      const example = makeExample();
      delete example.time;
      assert.throws(
        () => new Commute(example),
        AssertionError
      );
    });
  });
});

describe('Commute Store', ()=>{
  describe('mutations', ()=>{
    const expectedId = `??-[walking]->_ibE_ibE arrive_by ${now}`;
    describe('add', ()=>{
      it('works for one commute', ()=>{
        const store = makeStore();
        store.commit('commutes/add', makeExample());
        assert.deepEqual(
          Object.keys(store.state.commutes), [expectedId],
          'unexpected id(s)'
        );
        checkAttrs(
          store.state.commutes[expectedId],
          [
            ['id', `??-[walking]->_ibE_ibE arrive_by ${now}`],
            ['from', '??'],
            ['to', '_ibE_ibE'],
            ['mode', 'walking'],
            ['byOrAt', 'arrive_by'],
            ['time', now],
            ['included', true]
          ]
        );
      });
      it('avoids duplication', ()=>{
        const store = makeStore();
        store.commit('commutes/add', makeExample());
        store.commit('commutes/add', makeExample());
        assert.deepEqual(
          Object.keys(store.state.commutes), [expectedId],
          'unexpected id(s)'
        );
        checkAttrs(
          store.state.commutes[expectedId],
          [
            ['id', `??-[walking]->_ibE_ibE arrive_by ${now}`],
            ['from', '??'],
            ['to', '_ibE_ibE'],
            ['mode', 'walking'],
            ['byOrAt', 'arrive_by'],
            ['time', now],
            ['included', true]
          ]
        );
      });
    });
    describe('update', ()=>{
      it('can update frequency, notes, duration', ()=>{
        const store = makeStore();
        const compare = (attr, expected) => {
          assert.equal(store.state.commutes[expectedId][attr], expected, attr);
        };
        store.commit('commutes/add', makeExample());
        store.commit('commutes/update', {id: expectedId, notes: 'foo'});
        compare('notes', 'foo');
        store.commit('commutes/update', {id: expectedId, frequency: 2});
        compare('frequency', 2);
        store.commit('commutes/update', {id: expectedId, duration: 2});
        compare('duration', 2);
      });
    });
    describe('remove', ()=>{
      it('unsets `included`', ()=>{
        const store = makeStore();
        store.commit('commutes/add', makeExample());
        store.commit('commutes/remove', {id: expectedId, notes: 'foo'});
        assert.equal(store.state.commutes[expectedId].included, false);
      });
    });
  });
  describe('actions', ()=>{
    describe('add', ()=>{
      it('corretly adds a commute', ()=>{
        const store = makeStore();
        sinon.spy(store, 'commit');
        store.dispatch('commutes/add', makeExample());
        assert.deepEqual(
          store.commit.getCall(0).args,
          ['commutes/add', makeExample(), undefined]
        );
      });
    });
    describe('update', ()=>{
      it('correctly updates a commute\'s notes', ()=>{
        // this checks the clone action as well.
        const store = makePreppedStore();
        sinon.spy(store, 'commit');
        sinon.spy(store, 'dispatch');
        let notesOnly = {id: expectedId, notes: 'foo'};
        store.dispatch('commutes/update', notesOnly);
        assert.deepEqual(
          store.commit.getCall(0).args,
          ['commutes/update', notesOnly, undefined],
          'mismatched update commit call'
        );
      });
      it('update creates a new commute when mode is changed', ()=>{
        const store = makePreppedStore();
        sinon.spy(store, 'commit');
        sinon.spy(store, 'dispatch');
        let biking = {id: expectedId, mode: 'bicycling'};
        store.dispatch('commutes/update', biking);
        assert.deepEqual(
          store.dispatch.getCall(1).args,
          ['commutes/clone', biking],
          'mismatched clone commit call'
        );
        let expected = {
          ...makeExample(), ...biking,
          id: expectedId.replace('walking', 'bicycling')
        };
        assert.deepEqual(
          store.commit.getCall(0).args,
          ['commutes/add', expected, undefined],
          'mismatched add commit call'
        );
        assert.deepEqual(
          store.commit.getCall(1).args,
          ['commutes/remove', {
            ...makeExample(),
            id: expectedId, included: false
            // while it was called with included:true, the getCall returns the
            // commute object from the vuex store, which has been updated.
          }, undefined],
          'mismatched remove commit call'
        );
      });
      it('rejects a updates referring to nonexistant commutes', ()=>{
        const store = makeStore();
        let notesOnly = {id: expectedId, notes: 'foo'};
        assert.throws(
          ()=>store.dispatch('commutes/update', notesOnly),
          AssertionError
        );
      });
    });
  });
  describe('getters', ()=>{
    describe('included', ()=>{
      it('works', ()=>{
        let store = makeStore();
        console.log(store.getters['commutes/included']);
        assert.deepEqual(store.getters['commutes/included'], {});
        store.commit('commutes/add', makeExample());
        assert.deepEqual(
          Object.keys(store.getters['commutes/included']),
          [expectedId]
        );
        store.commit('locations/remove', {id: '??'});
        assert.deepEqual(store.getters['commutes/included'], {});
      });
    });
  });
});
// });
