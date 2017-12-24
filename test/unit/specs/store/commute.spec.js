import {
  mutations, getters, actions, Commute, roundTime
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
const makeExampleWithout = (...masked) => {
  const example = makeExample();
  masked.forEach((mask) => delete example[mask]);
  return example;
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
        console.log((store.commit.getCall(0)));
        // assert.deepEqual(
        //   store.commit.getCall(0).args,
        //   ['commute/add', makeExample()]
        // );
      });
    });
  })
});
