import React, { useState, useEffect } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import {
  useGetAllEmployeesBySortingQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from "../../services/api-services";
import DeleteModal from "../Modal/deletemodal";
import NewEmployee from "../Create/newemployee";
import { Button } from "react-bootstrap";
import * as moment from "moment";
import ListOperations from "../../services/crud.js";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "./view.css";
import UpdateEmployee from "../Update/updateemployee";
let page = 1;
const LIMIT = 100;

var initialQueryParams = {
  page: page,
  limit: LIMIT,
  column: "emp_no",
  order: "desc",
};
let column = "emp_no";
let order = "desc";

const ViewData = () => {
  const empData = useGetAllEmployeesBySortingQuery(initialQueryParams);
  const [dataReady, setDataReady] = useState(false);
  const [rowData, setRowData] = useState([]);  
  const [updateEmp, updateRespInfo] = useUpdateEmployeeMutation();
  const [delEmp, delRespInfo] = useDeleteEmployeeMutation();
  const [showModal, setShowModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [show, setShow] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [gridApi, setGridApi] = useState("");
  const [gridColumnApi, setGridColumnApi] = useState("");
  const [searchBox, setSearchBox] = useState("");
  const [item, setItem] = useState({
    title: "",
    id: "",
  });
  const [editItem, setEditItem] = useState({
    id: "",
  });
  const onbodyScrollEnd = async (params) => {
    if (rowData !== null) {
      let lastRow = params.api.getDisplayedRowAtIndex(
        params.api.getLastDisplayedRow()
      );
      if (lastRow !== undefined) {
        if (
          (params.direction === "vertical" &&
            params.left === 0 &&
            params.top === 0) ||
          lastRow.rowIndex >= page * (LIMIT - 1)
        ) {
          console.log(page * (LIMIT - 1));
          console.log(lastRow.rowIndex);

          const response = await ListOperations.geAllEmpBySort(
            page,
            LIMIT,
            column,
            order
          );
          let rowIndex = lastRow.rowIndex + 1;
          console.log(rowIndex);
          params.api.applyTransaction({
            add: response,
            addIndex: rowIndex,
          });

          page = page + 1;
        }
      }
    }
  };
  useEffect(() => {
    if (empData.isSuccess) {
      setDataReady(true);
      setRowData(empData.data);
    }
    if (updateRespInfo.isSuccess) {
      console.log(updateRespInfo);
      alert("Employee details updated.");
    }
    if (delRespInfo.isSuccess) {
      console.log(delRespInfo);
      alert("Deleted Record!");
    }
  }, [empData, updateRespInfo, delRespInfo]);

  const onGridReady = async (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    const updateData = (data) => {
      setRowData(data);
    };
    const response = await ListOperations.geAllEmp(page, LIMIT);
    updateData(response);
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
          // params.api.startEditingCell({
          //   rowIndex: params.node.rowIndex,
          //   // gets the first columnKey
          //   colKey: params.columnApi.getDisplayedCenterColumns()[0].colId,
          // });
          setEditItem({
            id: params.data.emp_no,
          });
          setShowEditModal(true);
          setShowEdit(true);
        }
        if (action === "delete") {
          setItem({
            title: params.data.first_name + " " + params.data.last_name,
            id: params.data.emp_no,
          });
          setShowModal(true);
          setShow(true);
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
  const hideEditModal = async () => {
    setShowEdit(false);
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
  const cancelEditModal = () => {
    setShowEdit(false);
    setEditItem("");
  };
  const onFilterTextBoxChanged = async (event) => {
    setSearchBox(event.target.value);
    const response = await ListOperations.geAllEmpBySortWithFilter(
      1,
      100,
      column,
      order,
      "first_name",
      event.target.value
    );
    setRowData(response);
    console.log(response.length);
  };
  const headerClick = async (params) => {
    var colState = gridColumnApi.getColumnState();
    var sortState = colState.filter(function (s) {
      return s.sort != null;
    });
    page = 1;
    column = sortState[0].colId;
    order = sortState[0].sort;
    console.log(column, order);
    const response = await ListOperations.geAllEmpBySort(
      page,
      LIMIT,
      column,
      order
    );
    setRowData(response);
  };

  // const filterBoxClick = async (params) => {
  //   console.log(params);
  //   var filterModel = params.api.getFilterModel();
  //   var sortState = filterModel;
  //   console.log(sortState);
  //   const propertyNames = Object.keys(sortState);

  //   switch (propertyNames[0]) {
  //     case "first_name":
  //       filterColumn = "first_name";
  //       filterText = sortState.first_name.filter;
  //       break;
  //     default:
  //       break;
  //   }
  //   console.log(filterColumn);
  //   console.log(filterText);

  // };

  return (
    <div className="view">
      <br />
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
      <div className="paddingDiv">
        <Button onClick={showNewEmp}> + Add Employee</Button>

        <div className="rightDiv">
          <input
            type="text"
            id="filter-text-box"
            placeholder="Search from table..."
            value={searchBox}
            onChange={onFilterTextBoxChanged}
          />
        </div>
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
      <div>
        {showEditModal && (
          <UpdateEmployee
            item={editItem}
            show={showEdit}
            handleClose={hideEditModal}
            close={cancelEditModal}
          />
        )}
      </div>
      {dataReady && (
        <div className="ag-theme-alpine" style={{ height: 450, width: 1200 }}>
          <AgGridReact
            defaultColDef={{
              flex: 1,
              minWidth: 150,
              sortable: true,

              filter: true,
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
            rowData={rowData}
            onGridReady={onGridReady}
            onBodyScrollEnd={onbodyScrollEnd}
            onCellClicked={onCellClicked}
            onRowEditingStopped={onRowEditingStopped}
            onRowEditingStarted={onRowEditingStarted}
            sortingOrder={["asc", "desc"]}
            onSortChanged={headerClick}
            // onFilterChanged={filterBoxClick}
          >
            <AgGridColumn
              field="emp_no"
              headerName="ID"
              suppressMenu={true}
            ></AgGridColumn>
            <AgGridColumn
              field="first_name"
              headerName="First Name"
              filter={true}
              sortable={true}
              suppressMenu={true}
            ></AgGridColumn>
            <AgGridColumn
              field="last_name"
              headerName="Last Name"
              filter={true}
              suppressMenu={true}
            ></AgGridColumn>
            <AgGridColumn
              field="gender"
              headerName="Gender"
              filter={false}
              suppressMenu={true}
            ></AgGridColumn>
            <AgGridColumn
              field="HireDate"
              headerName="Hiring Date"
              filter={false}
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
              filter={false}
            ></AgGridColumn>
          </AgGridReact>
        </div>
      )}
    </div>
  );
};
const actionCellRenderer = (params) => {
  let eGui = document.createElement("div");

  eGui.innerHTML = `
    <button class="btn btn-secondary"  data-action="edit" > EDIT  </button>  
    <button class="btn btn-warning deleteAnchor" data-action="delete"> DELETE  </button>  
    `;

  return eGui;
};
export default ViewData;
