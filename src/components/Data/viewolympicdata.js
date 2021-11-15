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
  const [initialLoad, setInitialLoad] = useState(false);
  const [item, setItem] = useState({
    title: "",
    id: "",
  });
  // const setTodosFromDatabase = (item) => {
  //   // IndexedDBService.InitializeDB()
  //   IndexedDBService.Create(item);
  // };
  const fetchData = async () => {
    const allEmpData = await listOperations.getEmp();
    dexieIndexedDb.addBulkDataToIndexedDB(allEmpData);
   
  };
  const onGridReady = async (params) => {
    try {
      let searchBoxVal = searchBoxRef.current.value;
      var offset;
      const datasource = {
        getRows(params) {
          if (searchBoxVal === "" && page === 1) {
            listOperations
              .geAllEmpBySort(page, LIMIT, column, order)
              .then((response) => {
                if (params.endRow >= 100) {
                  page = params.endRow / 100;
                  page++;
                }
                params.successCallback(response, response.lastRow);
                setInitialLoad(true);
              })
              .catch((error) => {
                console.error(error);
                params.failCallback();
                setHasError(true);
              });
              
          }
          if (searchBoxVal === "" && page > 1) {
            try {
              if (page === 1) offset = 0;
              else offset = (page - 1) * 100;

              dexieIndexedDb
                .sortByColumn(offset, LIMIT, column, order)
                .then((data) => {
                  params.successCallback(data, data.lastRow);
                });
              page++;
            } catch (error) {
              console.error(error);
            }
          }

          if (searchBoxVal !== "") {
            listOperations
              .geAllEmpBySortWithFilter(
                page,
                LIMIT,
                column,
                order,
                "first_name",
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
                localStorage.setItem("employeeData", JSON.stringify(data));
              })
              .catch((error) => {
                console.error(error);
                params.failCallback();
                setHasError(true);
              });
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
    fetchData();
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
      var sortState = colState.filter(function (s) {
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
  const onFilterTextBoxChanged = async (event) => {
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
              onChange={onFilterTextBoxChanged}
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
