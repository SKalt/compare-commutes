import db from '@/db.js';
import debug from 'debug';
debug.enable('db:*');
const log = debug('db:sync');
/**
 * performs allowed actions
 * @param  {String} action
 * @param  {Dexie.Table} table
 * @param  {Object} payload
 * @return {Promise}
 */
function perform(action, table, payload) {
  log(action, table, payload);
  switch (action) {
  case 'add':
    return table.put(payload, payload.id);
  case 'upate':
    return table.update(payload.id, payload);
  case 'remove':
    return table.update( payload.id, {included: false});
  case 'delete':
    return table.delete(payload.id);
  }
}

const syncToDb = (store) => {
  store.subscribe(({type, payload}, state) => {
    const [table, action] = type.split('/');
    switch (table) {
    case 'locations':
      return perform(action, db[table], payload);
    case 'commutes':
      return perform(action, db[table], payload);
    }
  });
};

export default syncToDb;
