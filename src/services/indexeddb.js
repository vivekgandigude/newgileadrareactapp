import Dexie from 'dexie';

const db = new Dexie("EmpDatabase");
db.version(2).stores({ dataset: "emp_no,first_name,last_name,HireDate,birth_date,gender,hire_date" });

export default db;