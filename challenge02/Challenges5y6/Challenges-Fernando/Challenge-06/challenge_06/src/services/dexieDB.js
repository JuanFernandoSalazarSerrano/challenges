import Dexie from 'dexie';

// Create a new Dexie database
export const db = new Dexie('fruitsDatabase');

// Define database schema
db.version(1).stores({
  fruits: '++id, name'
});

export default db;
