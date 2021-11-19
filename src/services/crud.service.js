import axios from "axios";
const BASEURL = "http://localhost:8081/api/";
class ListOperations {
  getEmp = async () => {
    const resp = await axios.get(BASEURL + "getEmployees");
    const respData = await resp.data;
    return respData;
  };
  getAllSalesData = async () => {
    const resp = await axios.get(BASEURL + "getAllTestListItems");
    const respData = await resp.data;
    return respData;
  };
  getSalesData = async (limit) => {
    const resp = await axios.get(
      BASEURL + "getAllTestListItems?limit=" + limit
    );
    const respData = await resp.data;
    return respData;
  };
  getNextSalesData = async (pid, limit) => {
    const resp = await axios.get(
      BASEURL + "getNextListItems?pid=" + pid + "&top=" + limit
    );
    const respData = await resp.data;
    return respData;
  };
  getListItemCount = async () => {
    const resp = await axios.get(BASEURL + "getListItemCount");
    const respData = await resp.data;
    return respData;
  };
  getEmpDetails = async (id) => {
    const resp = await axios.get(BASEURL + "getEmployeeDetails?id=" + id);
    const respData = await resp.data;
    return respData;
  };
  geAllEmp = async (page, limit) => {
    const resp = await axios.get(
      BASEURL + "getAllEmployees?page=" + page + "&limit=" + limit
    );

    const respData = await resp.data;
    return respData;
  };
  geAllEmpBySort = async (page, limit, column, order) => {
    const resp = await axios.get(
      BASEURL +
        "getAllEmployeesBySorting?page=" +
        page +
        "&limit=" +
        limit +
        "&column=" +
        column +
        "&order=" +
        order
    );

    const respData = await resp.data;
    return respData;
  };
  geAllEmpBySortWithFilter = async (
    page,
    limit,
    column,
    order,
    filterColumn,
    filterText
  ) => {
    const resp = await axios.get(
      BASEURL +
        "getAllEmployeesBySortWithFilter?page=" +
        page +
        "&limit=" +
        limit +
        "&column=" +
        column +
        "&order=" +
        order +
        "&filterColumn=" +
        filterColumn +
        "&filterText=" +
        filterText
    );

    const respData = await resp.data;
    return respData;
  };
}

const listOperations = new ListOperations();
export default listOperations;
