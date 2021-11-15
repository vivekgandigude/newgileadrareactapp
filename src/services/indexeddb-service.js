import config from "./config.json";

export class IndexedDBService {
  indexedDB;
  open;
  db;
  constructor() {
    this.indexedDB = window.indexedDB;
    this.InitializeDB();
  }

  InitializeDB() {
    this.open = this.indexedDB.open(config.dataBase, config.versionDB);

    this.open.onupgradeneeded = () => {
      this.db = this.open.result;
      const tx = this.db.createObjectStore(config.itemsStore, {
        keyPath: "emp_no",
      });
      tx.createIndex("ID", "id");
      tx.createIndex("EMPDATA", "empData");
    };

    this.open.onsuccess = () => {
      this.db = this.open.result;
    };
  }

  Get(id, callback) {
    let transaction = this.db.transaction(config.itemsStore, "readwrite");
    let itemStore = transaction.objectStore(config.itemsStore);

    
    let request = itemStore.get(id);
    request.onsuccess = function (event) {
      callback(request.result);
    };
  }

  GetAll(callback) {
    let transaction = this.db.transaction(config.itemsStore, "readwrite");
    let itemStore = transaction.objectStore(config.itemsStore);

    let request = itemStore.getAll();
    request.onerror = (error) => {
      console.log("you have error " + error);
    };
    request.onsuccess = (event) => {
      callback(request.result);
    };
  }

  Create(item) {
    let transaction = this.db.transaction(config.itemsStore, "readwrite");
    let itemStore = transaction.objectStore(config.itemsStore);

    item.map((i, index) => {
      itemStore.put({
        emp_no: i.emp_no,
        id: index,
        empData: i,
      });
      return true;
    });

    transaction.oncomplete = function (event) {
      // this.GetAll(callback);
      console.log(event);
    };
    transaction.onerror = function (event) {
      console.log(event);
    };
  }

  Delete(item, callback) {
    let transaction = this.db.transaction(config.itemsStore, "readwrite");
    let itemStore = transaction.objectStore(config.itemsStore);

    itemStore.delete(item.Id);
    transaction.oncomplete = () => {
      this.GetAll(callback);
    };
  }

  Update(item, callback) {
    let getItems = (fn) => this.GetAll(fn);

    let transaction = this.db.transaction(config.itemsStore, "readwrite");
    let itemStore = transaction.objectStore(config.itemsStore);

    let request = itemStore.get(item.Id);
    request.onsuccess = function (event) {
      let data = event.target.result;
      data.Comments = item.Comments;

      var requestUpdate = itemStore.put(data);
      requestUpdate.onsuccess = function (event) {
        getItems(callback);
      };
    };
  }
}

export default new IndexedDBService();
