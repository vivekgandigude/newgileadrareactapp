import React, { useEffect, useState, useRef } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import {
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from "../../services/api-services";
import DeleteModal from "../Modal/deletemodal";
import NewEmployee from "../Create/newemployee";
import { Button } from "react-bootstrap";
import * as moment from "moment";
import listOperations from "../../services/crud";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "./view.css";
//import IndexedDBService from "../../services/indexeddb-service";
import dexieIndexedDb from "../../services/dexie-indexeddb";

const LIMIT = 100;
let page = 1;
let column = "emp_no";
let order = "desc";
let filterColumn;
let filterText = "";
let propertyNames;
let sortState;
const ViewOlymicsData = () => {
  const searchBoxRef = useRef();
  const [updateEmp, updateRespInfo] = useUpdateEmployeeMutation();
  const [delEmp, delRespInfo] = useDeleteEmployeeMutation();
  const [showModal, setShowModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [show, setShow] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [searchBox, setSearchBox] = useState("");
  const [gridParams, setGridParams] = useState("");
  const [hasError, setHasError] = useState(false);

  const [item, setItem] = useState({
    title: "",
    id: "",
  });

  const FetchData = async () => {
    const allEmpData = await listOperations.getEmp();
    dexieIndexedDb.addBulkDataToIndexedDB(allEmpData);
  };
  const onGridReady = async (params) => {
    try {
      let searchBoxVal = searchBoxRef.current.value;
      var offset;
      const datasource = {
        getRows(params) {
          if (
            searchBoxVal === "" &&
            page === 1 &&
            filterText === "" &&
            sortState === undefined
          ) {
            listOperations
              .geAllEmpBySort(page, LIMIT, column, order)
              .then((response) => {
                if (params.endRow >= 100) {
                  page = params.endRow / 100;
                  page++;
                }
                params.successCallback(response, response.lastRow);
              })
              .catch((error) => {
                console.error(error);
                params.failCallback();
                setHasError(true);
              });
          }
          if (
            searchBoxVal === "" &&
            page > 1 &&
            (propertyNames === undefined || propertyNames.length === 0)
          ) {
            offset = (page - 1) * 100;
            dexieIndexedDb
              .sortByColumn(offset, LIMIT, column, order)
              .then((data) => {
                params.successCallback(data, data.lastRow);
              });
            page++;
          }
          if (
            searchBoxVal === "" &&
            page === 1 &&
            (propertyNames === undefined ||
              propertyNames.length === 0 ||
              sortState !== undefined) &&
            filterText === ""
          ) {
            offset = 0;
            dexieIndexedDb
              .sortByColumn(offset, LIMIT, column, order)
              .then((data) => {
                params.successCallback(data, data.lastRow);
              });
            page++;
          }
          if (searchBoxVal !== "") {
            listOperations
              .geAllEmpBySortWithFilter(
                page,
                LIMIT,
                column,
                order,
                filterColumn,
                searchBoxVal
              )
              .then((data) => {
                if (params.endRow >= 100) {
                  page = params.endRow / 100;
                  page++;
                }
                var lastRow = "";
                if (data.length < 100) {
                  lastRow = data.length;
                } else {
                  lastRow = data.lastRow;
                }
                params.successCallback(data, lastRow);
              })
              .catch((error) => {
                console.error(error);
                params.failCallback();
                setHasError(true);
              });
          }
          if (filterText !== "") {
            if (page === 1) offset = 0;
            else offset = (page - 1) * 100;
            dexieIndexedDb
              .filterByColumn(page, LIMIT, "", "", filterText, filterColumn)
              .then((result) => {
                params.successCallback(result, result.length);
              })
              .catch((error) => {
                console.error(error);
                params.failCallback();
                setHasError(true);
              });
            page++;
          }
        },
      };

      params.api.setDatasource(datasource);
      setGridParams(params);
      setHasError(false);
    } catch (err) {
      console.log(err);
      setHasError(true);
    }
  };
  const formatDate = (date) => {
    console.log(moment(date).format("yyyy-MM-DD"));
    return moment(date).format("yyyy-MM-DD");
  };
  const onRowEditingStarted = (params) => {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true,
    });
  };
  const onRowEditingStopped = (params) => {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true,
    });
  };
  const onCellClicked = async (params) => {
    let action;
    try {
      if (
        params.column.colId === "action" &&
        params.event.target.dataset.action
      ) {
        action = params.event.target.dataset.action;

        if (action === "edit") {
          params.api.startEditingCell({
            rowIndex: params.node.rowIndex,
            // gets the first columnKey
            colKey: params.columnApi.getDisplayedCenterColumns()[0].colId,
          });
        }
        if (action === "delete") {
          setShowModal(true);
          setShow(true);
          setItem({
            title: params.data.first_name + " " + params.data.last_name,
            id: params.data.emp_no,
          });
        }
        if (action === "update") {
          params.api.stopEditing(false);

          var hireDateFormatted = formatDate(params.data.hire_date);
          var dobFormatted = formatDate(params.data.birth_date);
          const empData = {};
          empData.empno = params.data.emp_no;
          empData.firstname = params.data.first_name;
          empData.lastname = params.data.last_name;
          empData.hireDate = hireDateFormatted;
          empData.dob = dobFormatted;
          empData.gender = params.data.gender;

          await updateEmp(empData);
        }

        if (action === "cancel") {
          params.api.stopEditing(true);
        }
      }
      if (action === "update") {
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (updateRespInfo.isSuccess) {
      console.log(updateRespInfo);
      //alert("Employee details updated.");
    }
    if (delRespInfo.isSuccess) {
      console.log(delRespInfo);
      //alert("Deleted Record!");
    }
    FetchData();
  }, [updateRespInfo, delRespInfo]);
  const hideModal = async () => {
    await delEmp(item.id);
    setShow(false);
    window.location.reload();
  };
  const hideNewModal = async () => {
    setShowNew(false);
    window.location.reload();
  };

  const showNewEmp = () => {
    setShowNewModal(true);
    setShowNew(true);
  };
  const cancelModal = () => {
    setShow(false);
  };
  const cancelNewModal = () => {
    setShowNew(false);
  };

  const headerClick = async (params) => {
    try {
      var colState = params.columnApi.getColumnState();
      sortState = colState.filter(function (s) {
        return s.sort != null;
      });
      page = 1;
      column = sortState[0].colId;
      order = sortState[0].sort;
      console.log(column, order);

      onGridReady(params);
    } catch (err) {
      console.log(err);
    }
  };

  const onColumnFilter = async (params) => {
    var filterModel = params.api.getFilterModel();
    const firstNameFilter = params.api.getFilterInstance("first_name");
    const lastNameFilter = params.api.getFilterInstance("last_name");
    const genderFilter = params.api.getFilterInstance("gender");
    const empnoFilter = params.api.getFilterInstance("emp_no");
    const hiredateFilter = params.api.getFilterInstance("HireDate");
    let queryColumn = "";
    let queryText = "";

    if (firstNameFilter.appliedModel !== null) {
      queryColumn += "first_name";
      queryText += firstNameFilter.appliedModel.filter + ",";
    }
    if (lastNameFilter.appliedModel !== null) {
      queryColumn += "+last_name";
      queryText += lastNameFilter.appliedModel.filter + ",";
    }
    if (genderFilter.appliedModel !== null) {
      queryColumn += "+gender";
      queryText += genderFilter.appliedModel.filter + ",";
    }
    if (hiredateFilter.appliedModel !== null) {
      queryColumn += "+hire_date";
      queryText += hiredateFilter.appliedModel.filter + ",";
    }
    if (empnoFilter.appliedModel !== null) {
      queryColumn += "+emp_no";
      queryText += empnoFilter.appliedModel.filter + ",";
    }
    queryText = queryText.replace(/,\s*$/, "");
    console.log(queryColumn, queryText);
    //firstNameFilter.appliedModel.filter=""
    propertyNames = Object.keys(filterModel);
    page = 1;
    if (propertyNames.length > 0) {
      switch (propertyNames[propertyNames.length - 1]) {
        case "first_name":
          filterColumn = "first_name";
          filterText = filterModel.first_name.filter;
          break;
        case "last_name":
          filterColumn = "last_name";
          filterText = filterModel.last_name.filter;
          break;
        case "emp_no":
          filterColumn = "emp_no";
          filterText = filterModel.emp_no.filter;
          break;
        case "gender":
          filterColumn = "gender";
          filterText = filterModel.gender.filter;
          break;
        default:
          break;
      }
      console.log(filterColumn);
      console.log(filterText);
    } else {
      filterColumn = "";
      filterText = "";
    }
    // const searchData = await dexieIndexedDb.filterByColumn(
    //   page,
    //   100,
    //   "first_name",
    //   "asc",
    //   filterText,
    //   filterColumn
    // );
    // const searchData = await dexieIndexedDb.getTableData(
    //   1,
    //   100,
    //   filterText,
    //   "first_name"
    // );
  };
  const onSearchBoxChange = async (event) => {
    setSearchBox(event.target.value);
    page = 1;
    onGridReady(gridParams);
  };
  if (hasError) {
    return <p>Sorry, Something went wrong!</p>;
  } else {
    return (
      <div className="view">
        <div className="paddingDiv">
          <Button onClick={showNewEmp}> + Add Employee</Button>

          <div className="rightDiv">
            <input
              ref={searchBoxRef}
              type="text"
              id="filter-text-box"
              placeholder="Search from table..."
              value={searchBox}
              onChange={onSearchBoxChange}
            />
          </div>
        </div>
        <div>
          {showModal && (
            <DeleteModal
              item={item}
              show={show}
              handleClose={hideModal}
              close={cancelModal}
            />
          )}
        </div>

        <div>
          {showNewModal && (
            <NewEmployee
              show={showNew}
              handleClose={hideNewModal}
              close={cancelNewModal}
            />
          )}
        </div>

        <div className="ag-theme-alpine" style={{ height: 600, width: 1250 }}>
          <AgGridReact
            rowModelType={"infinite"}
            defaultColDef={{
              minWidth: 150,
              sortable: true,
              filter: true,
              floatingFilter: true,
            }}
            components={{
              loadingRenderer: function (params) {
                if (params.value !== undefined) {
                  return params.value;
                } else {
                  return '<img src="http://www.ag-grid.com/example-assets/loading.gif">';
                }
              },
            }}
            editType="fullRow"
            sortingOrder={["asc", "desc"]}
            onCellClicked={onCellClicked}
            onRowEditingStopped={onRowEditingStopped}
            onRowEditingStarted={onRowEditingStarted}
            onSortChanged={headerClick}
            onGridReady={onGridReady}
            // onFilterTextBoxChanged={onColumnFilter}
            onFilterChanged={onColumnFilter}
          >
            <AgGridColumn
              field="emp_no"
              headerName="Emp ID"
              minWidth={100}
              editable={false}
            ></AgGridColumn>
            <AgGridColumn
              field="first_name"
              headerName="First Name"
              editable={true}
              colId="first_name"
              filterParams={{
                filterOptions: ["equals", "contains"],
                suppressAndOrCondition: true,
              }}
            ></AgGridColumn>
            <AgGridColumn
              field="last_name"
              headerName="Last Name"
              editable={true}
            ></AgGridColumn>
            <AgGridColumn field="gender" headerName="Gender"></AgGridColumn>
            <AgGridColumn
              field="HireDate"
              headerName="Hire Date"
            ></AgGridColumn>

            <AgGridColumn
              headerName="Action"
              minWidth="200"
              cellRenderer={actionCellRenderer}
              editable={false}
              colId="action"
              suppressMenu={true}
              sortable={false}
              filter={false}
            ></AgGridColumn>
          </AgGridReact>
        </div>
      </div>
    );
  }
};

const actionCellRenderer = (params) => {
  let eGui = document.createElement("div");

  let editingCells = params.api.getEditingCells();
  // checks if the rowIndex matches in at least one of the editing cells
  let isCurrentRowEditing = editingCells.some((cell) => {
    return cell.rowIndex === params.node.rowIndex;
  });

  if (isCurrentRowEditing) {
    eGui.innerHTML = `
    <button  class="btn btn-success"  data-action="update"> UPDATE  </button>
    <button  class="btn btn-info"  data-action="cancel" > CANCEL </button>
    `;
  } else {
    eGui.innerHTML = `
    <button class="btn btn-secondary"  data-action="edit" > EDIT  </button>  
    <button class="btn btn-warning deleteAnchor" data-action="delete"> DELETE  </button>  
    `;
  }

  return eGui;
};

export default ViewOlymicsData;
