import { Connection } from "jsstore";

import workerInjector from "jsstore/dist/worker_injector";

// This will ensure that we are using only one instance.
// Otherwise due to multiple instance multiple worker will be created.

export const idbCon = new Connection();
export const dbname = "EmpDatabase";
idbCon.addPlugin(workerInjector);
const getDatabase = () => {
  const tblEmp = {
    name: "dataset",
  };
  const dataBase = {
    name: dbname,
    tables: [tblEmp],
  };
  return dataBase;
};

export const initJsStore2 = () => {
  try {
    const dataBase = getDatabase();
    idbCon.initDb(dataBase);
  } catch (ex) {
    console.error(ex);
  }
};

export class BaseService2 {
  get connection() {
    return idbCon;
  }
}
export class EmpService2 extends BaseService2 {
  constructor() {
    super();
    this.tableName = "dataset";
  }

  async getStudents(offset, limit) {
    debugger;
    const results = await this.connection.select({
      from: this.tableName,
      where: {
        skip: offset,
        limit: limit,
      },
    });
    return results;
  }
}
