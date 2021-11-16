import { BaseService } from "./base.service";

export class EmpService extends BaseService {
  constructor() {
    super();
    this.tableName = "Employees";
  }

  async getStudents(offset, limit) {
    const results = await this.connection.select({
      from: this.tableName,
      where: {
        skip: offset,
        limit: limit,
      },
    });
    return results;
  }

  async addStudent(data) {
    await this.connection.clear(this.tableName);
    console.log("data cleared successfully");
    await data.map((emp) => {
      this.connection.insert({
        into: this.tableName,
        values: [emp],
      });
    });
  }

  getStudentById(id) {
    return this.connection.select({
      from: this.tableName,
      where: {
        emp_no: id,
      },
    });
  }

  removeStudent(id) {
    return this.connection.remove({
      from: this.tableName,
      where: {
        id: id,
      },
    });
  }

  updateStudentById(id, updateData) {
    return this.connection.update({
      in: this.tableName,
      set: updateData,
      where: {
        id: id,
      },
    });
  }
}
