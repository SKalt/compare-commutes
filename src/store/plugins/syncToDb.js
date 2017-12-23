import db from '@/db.js';

/**
 * performs allowed actions
 * @param  {String} action
 * @param  {Dexie.Table} table
 * @param  {Object} payload
 * @return {Promise}
 */
function perform(action, table, payload) {
  switch (action) {
  case 'add':
    return table.put(payload, payload.id);
  case 'upate':
    return table.update(payload, payload.id);
  case 'remove':
    return table.update({included: false}, payload.id);
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
