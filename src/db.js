// Sync store with dexie on startup and mutations/actions
import Dexie from 'dexie';
const db = new Dexie('geodb');

db.version(1).stores({
  locations: 'id,[lat+lng],notes,is_origin,last_touch',
  commutes: 'id,[origin+dest+by_or_at+time+mode],notes,duration,last_touch'
});

// db cleaning: executed once per import.
const now = new Date();
/**
 * Delete entries which have not been used for a month
 * @private
 * @param  {Dexie.Table} table
 * @return {Promise}
 */
function filterOutOldEntries(table) {
  return table.toArray()
  .then(
    (entries) => entries
      .filter(({last_touch}) => now - new Date(last_touch) < 2592e6)
      .map((oldEntry) => oldEntry.id)
  )
  .then((idsToDelete) => table.bulkDelete(idsToDelete));
}

filterOutOldEntries(db.locations);
filterOutOldEntries(db.commutes);

export default db;
// if (process.env.NODE_ENV == 'development') window.db = db;
