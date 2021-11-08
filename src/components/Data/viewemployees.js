import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import {
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from "../../services/api-services";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import * as moment from "moment";
import "./view.css";
import ListOperations from "../../services/crud.js";
import Loading from "react-fullscreen-loading";
import DeleteModal from "../Modal/deletemodal";
import NewEmployee from "../Create/newemployee";
import { Button } from "react-bootstrap";
const ViewEmployees = () => {
  const history = useHistory();
  const [updateEmp, updateRespInfo] = useUpdateEmployeeMutation();
  const [delEmp, delRespInfo] = useDeleteEmployeeMutation();
  const [dataReady, setDataReady] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [show, setShow] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [item, setItem] = useState({
    title: "",
    id: "",
  });
  const formatDate = (date) => {
    console.log(moment(date).format("yyyy-MM-DD"));
    return moment(date).format("yyyy-MM-DD");
  };

  const onGridReady = async (params) => {
    try {
      const updateData = (data) => {
        data.forEach(function (data, index) {
          data.id = "R" + (index + 1);
        });

        var dataSource = {
          rowCount: null,
          getRows: function (params) {
            console.log(
              "asking for " + params.startRow + " to " + params.endRow
            );

            var dataAfterSortingAndFiltering = sortAndFilter(
              data,
              params.sortModel,
              params.filterModel
            );
            var rowsThisPage = dataAfterSortingAndFiltering.slice(
              params.startRow,
              params.endRow
            );
            var lastRow = -1;
            if (dataAfterSortingAndFiltering.length <= params.endRow) {
              lastRow = dataAfterSortingAndFiltering.length;
            }

            params.successCallback(rowsThisPage, lastRow);
          },
        };
        params.api.setDatasource(dataSource);
      };
      try {
        const listData = await ListOperations.getEmp();
        updateData(listData);
        localStorage.setItem("empData", JSON.stringify(listData));
      } catch (error) {
        console.log(error);
        updateData(JSON.parse(localStorage.getItem("empData")));
      }
    } catch (err) {}
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

  useEffect(() => {
    if (rowData !== null) {
      setDataReady(true);
    }
    if (updateRespInfo.isSuccess) {
      console.log(updateRespInfo);
      alert("Employee details updated.");
    }
  }, [rowData, updateRespInfo]);

  const onCellClicked = async (params) => {
    let action;
    try {
      if (params.column.colId === "actions") {
        action = params.event.target.dataset.action;
        if (action === "delete") {
          //history.push("/employees/delete/" + params.data.emp_no);
          setShowModal(true);
          setShow(true);
          setItem({
            title: params.data.first_name + " " + params.data.last_name,
            id: params.data.emp_no,
          });
        }
      }
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
          //history.push("/employees/delete/" + params.data.emp_no);
          setShowModal(true);
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
  return (
    <div className="view">
      <div>
        <div>
          {!dataReady && (
            <Loading loading={true} background="#D7CEE1" loaderColor="#000" />
          )}
        </div>
        <div className="linkDiv">
          {/* <Link to="/employees/add" className="link">
           
          </Link> */}
          <Button onClick={showNewEmp}> + Add Employee</Button>
        </div>
      </div>
      <br />
      <div>
        <div>
          {showNewModal && (
            <NewEmployee
              show={showNew}
              handleClose={hideNewModal}
              close={cancelNewModal}
            />
          )}
        </div>
      </div>

      {dataReady && (
        <div className="ag-theme-alpine" style={{ height: 600, width: 1200 }}>
          <AgGridReact
            defaultColDef={{
              flex: 1,
              minWidth: 150,
              sortable: true,
              resizable: true,
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
            //rowBuffer={0}
            rowSelection={"multiple"}
            rowModelType={"infinite"}
            cacheOverflowSize={2}
            maxConcurrentDatasourceRequests={2}
            infiniteInitialRowCount={1}
            maxBlocksInCache={10}
            cacheBlockSize={100}
            editType="fullRow"
            onCellClicked={onCellClicked}
            onRowEditingStopped={onRowEditingStopped}
            onRowEditingStarted={onRowEditingStarted}
            //  pagination={true}
            //paginationPageSize={10}
            //animateRows={true}
            //onBodyScroll=
            onGridReady={onGridReady}
          >
            <AgGridColumn
              field="emp_no"
              headerName="ID"
              editable={false}
              sortable={true}
              filter={true}
              filterParams={{
                filterOptions: ["equals"],
                suppressAndOrCondition: true,
              }}
            ></AgGridColumn>
            <AgGridColumn
              field="first_name"
              headerName="First Name"
              editable={true}
              filterParams={{
                filterOptions: ["equals", "contains"],
                suppressAndOrCondition: true,
              }}
              filter={true}
            ></AgGridColumn>
            <AgGridColumn
              field="last_name"
              headerName="Last Name"
              editable={true}
              filterParams={{
                filterOptions: ["equals", "contains"],
                suppressAndOrCondition: true,
              }}
              filter={true}
            ></AgGridColumn>
            <AgGridColumn
              field="gender"
              headerName="Gender"
              editable={false}
            ></AgGridColumn>
            <AgGridColumn
              field="HireDate"
              headerName="Hire Date"
              editable={false}
              suppressMenu={true}
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
            <AgGridColumn
              cellRenderer={deleteCellRender}
              editable={false}
              colId="actions"
              suppressMenu={true}
              sortable={false}
            ></AgGridColumn>
          </AgGridReact>
        </div>
      )}
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
    </div>
  );
};
const sortAndFilter = (allOfTheData, sortModel, filterModel) => {
  return sortData(sortModel, filterData(filterModel, allOfTheData));
};
const sortData = (sortModel, data) => {
  debugger
  var sortPresent = sortModel && sortModel.length > 0;
  if (!sortPresent) {
    return data;
  }
  var resultOfSort = data.slice();
  resultOfSort.sort(function (a, b) {
    for (var k = 0; k < sortModel.length; k++) {
      var sortColModel = sortModel[k];
      var valueA = a[sortColModel.colId];
      var valueB = b[sortColModel.colId];
      if (valueA === valueB) {
        continue;
      }
      var sortDirection = sortColModel.sort === "asc" ? 1 : -1;
      if (valueA > valueB) {
        return sortDirection;
      } else {
        return sortDirection * -1;
      }
    }
    return 0;
  });
  return resultOfSort;
};
function filterData(filterModel, data) {
  var filterPresent = filterModel && Object.keys(filterModel).length > 0;
  if (!filterPresent) {
    return data;
  }
  var resultOfFilter = [];
  for (var i = 0; i < data.length; i++) {
    var item = data[i];

    if (filterModel.first_name) {
      if (
        item.first_name
          .toLowerCase()
          .indexOf(filterModel.first_name.filter.toLowerCase()) < 0
      ) {
        continue;
      }
    }
    if (filterModel.last_name) {
      if (
        item.last_name
          .toLowerCase()
          .indexOf(filterModel.last_name.filter.toLowerCase()) < 0
      ) {
        continue;
      }
    }

    if (filterModel.emp_no) {
      var emp_no = item.emp_no;
      var allowedempno = parseInt(filterModel.emp_no.filter);
      if (filterModel.emp_no.type === "equals") {
        if (emp_no !== allowedempno) {
          continue;
        }
      }
    }

    resultOfFilter.push(item);
  }
  return resultOfFilter;
}
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
    
    `;
    // eGui.innerHTML = `
    // <button class="action-button edit"  data-action="edit" > EDIT  </button>
    // <button class="action-button delete" data-action="delete" > DELETE </button>
    // `;
  }

  return eGui;
};
const deleteCellRender = (params) => {
  let eGui = document.createElement("div");

  eGui.innerHTML = `
   <button class="btn btn-warning deleteAnchor" data-action="delete"> DELETE  </button>
    `;

  //   eGui.innerHTML = `
  //  <a  class="action-button delete deleteAnchor" data-action="delete">Delete</a>
  //   `;

  return eGui;
};

export default ViewEmployees;
