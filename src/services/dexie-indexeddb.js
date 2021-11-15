import db from "./indexeddb";

class DexieIndexedDb {
  addBulkDataToIndexedDB(data) {
    return new Promise((resolve, reject) => {
      if (db.table("dataset") !== null || db.table("dataset") !== undefined) {
        db.table("dataset").clear();
      }
      db.table("dataset")
        .bulkAdd(data)
        .then((data) => {
          resolve(data);
        });
    });
  }
  sortByColumn(offset, limit, column, order) {
    return new Promise(async (resolve, reject) => {
      console.log(offset, limit);
      console.log(column, order);
      if (order === "desc") {
        db.table("dataset")
          .orderBy(column)
          .reverse()
          .offset(offset)
          .limit(limit)
          .toArray()
          .then(function (results) {
            resolve(results);
          });
      } else {
        db.table("dataset")
          .orderBy(column)
          .offset(offset)
          .limit(limit)
          .toArray()
          .then(function (results) {
            resolve(results);
          });
      }
    });
  }
}
const dexieIndexedDb = new DexieIndexedDb();
export default dexieIndexedDb;
