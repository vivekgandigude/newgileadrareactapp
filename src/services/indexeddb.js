import Dexie from "dexie";

const db = new Dexie("EmpDatabase");
db.version(6).stores(
  // {
  //   dataset: "emp_no,first_name,last_name,HireDate,birth_date,gender,hire_date",
  // }
  { salesdb: "ID,Title,field_1,field_2,field_3" }
);

export default db;
