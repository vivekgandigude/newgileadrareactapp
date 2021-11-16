import db from "./indexeddb";

class DexieIndexedDb {
  addBulkDataToIndexedDB(data) {
    return new Promise((resolve, reject) => {
      if (db.table("dataset") !== null || db.table("dataset") !== undefined) {
        db.table("dataset").clear();
        console.log("data clear!");
      }
      db.table("dataset")
        .bulkAdd(data)
        .then((data) => {
          resolve(data);
          console.log("data added!");
        })
        .catch((error) => {
          console.log(error);
          reject(error);
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
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      } else {
        db.table("dataset")
          .orderBy(column)
          .offset(offset)
          .limit(limit)
          .toArray()
          .then(function (results) {
            resolve(results);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      }
    });
  }
  async filterByColumn(offset, limit, column, order, filterText, filterColumn) {
    return new Promise(async (resolve, reject) => {
      await db
        .table("dataset")
        .where(filterColumn)
        .equalsIgnoreCase(filterText)
        .toArray()
        .then(function (results) {
          const paginate = results.slice(
            (offset - 1) * limit,
            offset * limit
          );
          resolve(paginate);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  getTableData(offset, limit, filterText, filterColumn) {
    return new Promise(async (resolve, reject) => {
      db.table("dataset")
        .toArray()

        .then(function (results) {
          const filterData = results.filter(
            (item) =>
              item[filterColumn].includes(filterText) && item["gender"] === "M"
          );

          const paginate = filterData.slice(
            (offset - 1) * limit,
            offset * limit
          );
          resolve(paginate);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }
}
const dexieIndexedDb = new DexieIndexedDb();
export default dexieIndexedDb;
