import db from '@/db.js';
import {assert} from 'chai';
import polyline from 'polyline';
const now = new Date();
// const then = new Date(now - 3e10);
// import * as turf from '@turf/helpers';
describe('the IndexedDB database', ()=>{
  const [lat, lng] = [43.252, -126.453];
  const example = {lat, lng, notes: 'foo', is_origin: false, last_touch: now};
  const id = polyline.encode([[lat, lng]]);
  it('has both location and commute tables', ()=>{
    assert.ok(db.locations);
    assert.ok(db.commutes);
  });
  it('inserts locations correctly', ()=>{
    return db.locations.add({...example, id});
  });
  it('updates locations correctly', ()=>{
    return db.locations.update(id, {notes: 'bar'}).then(()=>{
      return db.locations.get(id).then((loc)=>{
        assert.equal(loc.notes, 'bar', 'item not updated');
      });
    });
  });
});
