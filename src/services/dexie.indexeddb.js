import db from "./indexeddb";
import empdb from "./empdb";

const DATASET = "dataset";
const SPLISTDATASET = "salesdb";
class DexieIndexedDb {
  addBulkDataToIndexedDB(data) {
    return new Promise((resolve, reject) => {
      if (empdb.table(DATASET) !== null || empdb.table(DATASET) !== undefined) {
        empdb.table(DATASET).clear();
        console.log("data clear!");
      }
      empdb
        .table(DATASET)
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
  addListDataToIndexedDB(data) {
    return new Promise((resolve, reject) => {
      if (db.table(SPLISTDATASET) === undefined) {
      }
      if (
        db.table(SPLISTDATASET) !== null ||
        db.table(SPLISTDATASET) !== undefined
      ) {
        db.table(SPLISTDATASET).clear();
        console.log("data clear!");
      }
      db.table(SPLISTDATASET)
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
        empdb
          .table(DATASET)
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
        empdb
          .table(DATASET)
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
  getListDatasortByColumn(offset, limit, column, order) {
    return new Promise(async (resolve, reject) => {
      console.log(offset, limit);
      console.log(column, order);
      if (order === "desc") {
        db.table(SPLISTDATASET)
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
        db.table(SPLISTDATASET)
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
  filterByColumn(offset, limit, column, order, filterText, filterColumn) {
    return new Promise(async (resolve, reject) => {
      empdb
        .table(DATASET)
        .where(filterColumn)
        .equalsIgnoreCase(filterText)
        .toArray()
        .then(function (results) {
          const paginate = results.slice((offset - 1) * limit, offset * limit);
          resolve(paginate);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }
  getFilteredListDataByColumn(offset, limit, filterText, filterColumn) {
    return new Promise(async (resolve, reject) => {
      db.table(SPLISTDATASET)
        .where(filterColumn)
        .equalsIgnoreCase(filterText)
        .toArray()
        .then(function (results) {
          const paginate = results.slice((offset - 1) * limit, offset * limit);
          resolve(paginate);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }
  udpdatesListItem(id, salesdata) {
    return new Promise(async (resolve, reject) => {
      db.table(SPLISTDATASET)
        .update(id, {
          Title: salesdata.title,
          field_1: salesdata.country,
          field_2: salesdata.itemtype,
          field_3: salesdata.saleschannel,
        })
        .then(function (updated) {
          if (updated) {
            console.log("item ID :" + id + " udpated");
            resolve(updated);
          } else {
            console.log("error");
            reject("error");
          }
        })
        .catch((error) => {
          console.error("error : " + error);
        });
    });
  }
  addListItem(id, salesdata) {
    return new Promise(async (resolve, reject) => {
      db.table(SPLISTDATASET)
        .add({
          ID: id,
          Title: salesdata.title,
          field_1: salesdata.country,
          field_2: salesdata.itemtype,
          field_3: salesdata.saleschannel,
        })
        .then(function (updated) {
          if (updated) resolve(updated);
          else reject("error");
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  deleteListItem(id) {
    return new Promise(async (resolve, reject) => {
      
      db.table(SPLISTDATASET)
        .where("ID")
        .equals(id)
        .delete()
        .then(function (deleteCount) {
          console.log("Deleted " + deleteCount + " rows");
          resolve(deleteCount);
        })
        .catch(function (error) {
          console.error("Error: " + error);
          reject(error);
        });
    });
  }

  getTableData(offset, limit, filterText, filterColumn) {
    return new Promise(async (resolve, reject) => {
      empdb
        .table(DATASET)
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
