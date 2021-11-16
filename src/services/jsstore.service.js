import { DATA_TYPE, Connection } from "jsstore";

import workerInjector from "jsstore/dist/worker_injector";

// This will ensure that we are using only one instance.
// Otherwise due to multiple instance multiple worker will be created.

export const idbCon = new Connection();
export const dbname = "Demo";
idbCon.addPlugin(workerInjector);
const getDatabase = () => {
  const tblEmp = {
    name: "Employees",
    columns: {
      emp_no: {
        primaryKey: true,
        autoIncrement: false,
      },
      first_name: {
        notNull: true,
        dataType: DATA_TYPE.String,
      },
      gender: {
        dataType: DATA_TYPE.String,
        default: "M",
      },
      last_name: {
        notNull: true,
        dataType: DATA_TYPE.String,
      },

      birth_date: {
        dataType: DATA_TYPE.String,
        notNull: true,
      },
      HireDate: {
        dataType: DATA_TYPE.String,
        notNull: true,
      },
      hire_date: {
        dataType: DATA_TYPE.String,
        notNull: true,
      },
    },
  };
  const dataBase = {
    name: dbname,
    tables: [tblEmp],
  };
  return dataBase;
};

export const initJsStore = () => {
  try {
    const dataBase = getDatabase();
    idbCon.initDb(dataBase);
  } catch (ex) {
    console.error(ex);
  }
};
