import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useUpdateEmployeeMutation } from "../../services/api-services";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import * as moment from "moment";
import "./view.css";

const ViewEmployees = () => {
  const history = useHistory();
  const [updateEmp, updateRespInfo] = useUpdateEmployeeMutation();
  const [dataReady, setDataReady] = useState(false);
  const [rowData, setRowData] = useState([]);
  const BASEURL = "http://localhost:8081/api/";

  const formatDate = (date) => {
    console.log(moment(date).format("yyyy-MM-DD"));
    return moment(date).format("yyyy-MM-DD");
  };

  const onGridReady = async (params) => {
    try {
      const updateData = (data) => {
        //setRowData(data);
        var dataSource = {
          rowCount: null,
          getRows: function (params) {
            console.log(
              "asking for " + params.startRow + " to " + params.endRow
            );
            setTimeout(function () {
              var rowsThisPage = data.slice(params.startRow, params.endRow);
              var lastRow = -1;
              if (data.length <= params.endRow) {
                lastRow = data.length;
              }
              params.successCallback(rowsThisPage, lastRow);
            }, 500);
          },
        };

        params.api.setDatasource(dataSource);
      };

      const resp = await fetch(BASEURL + "getEmployees");
      const respData = await resp.json();
      updateData(respData);
    } catch (err) {
      console.log(err);
    }
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
    // if (updateRespInfo.isSuccess) {
    //   alert("Updated");
    // }
  }, [rowData]);

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
          history.push("/employees/delete/" + params.data.emp_no);
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
          console.log(empData);
          await updateEmp(empData);
          // const postData = await axios.post(
          //   BASEURL + "updateEmployee",
          //   empData
          // );
          // const response = await postData.data;
          console.log(updateRespInfo);
          alert("Employee Updated!");
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
  const dateValueFormat = (data) => {
    return moment(data.value).format("MM/DD/yyyy");
  };
  return (
    <div className="view">
      <div>
        <div className="linkDiv">
          <Link to="/employees/add" className="link">
            + Add Employee
          </Link>
        </div>
      </div>
      <br />
      <div className="dropdown">
        <br />
      </div>
      {dataReady && (
        <div className="ag-theme-alpine" style={{ height: 600, width: 1200 }}>
          <AgGridReact
            //rowData={rowData}
            onGridReady={onGridReady}
            paginationPageSize="50"
            defaultColDef={{
              flex: 1,
              minWidth: 110,

              resizable: true,
              sortable: true,
            }}
            components={{
              loadingRenderer: function (params) {
                if (params.value !== undefined) {
                  return params.value;
                } else {
                  return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
                }
              },
            }}
            rowBuffer={0}
            rowSelection={"multiple"}
            rowModelType={"infinite"}
            cacheOverflowSize={2}
            maxConcurrentDatasourceRequests={1}
            infiniteInitialRowCount={1000}
            maxBlocksInCache={10}
            editType="fullRow"
            onCellClicked={onCellClicked}
            onRowEditingStopped={onRowEditingStopped}
            onRowEditingStarted={onRowEditingStarted}
          >
            <AgGridColumn
              field="emp_no"
              headerName="ID"
              editable={false}
              sortable={true}
            ></AgGridColumn>
            <AgGridColumn
              field="first_name"
              headerName="First Name"
              editable={true}
              filter={true}
            ></AgGridColumn>
            <AgGridColumn
              field="last_name"
              headerName="Last Name"
              editable={true}
              filter={true}
            ></AgGridColumn>
            <AgGridColumn
              field="gender"
              headerName="Gender"
              editable={false}
              filter={true}
            ></AgGridColumn>
            <AgGridColumn
              field="hire_date"
              headerName="Hire Date"
              editable={false}
              cellRenderer={dateValueFormat}
              filter={true}
            ></AgGridColumn>

            <AgGridColumn
              headerName="Action"
              minWidth="150"
              cellRenderer={actionCellRenderer}
              editable={false}
              colId="action"
            ></AgGridColumn>
          </AgGridReact>
        </div>
      )}
    </div>
  );
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
    <button  class="action-button update"  data-action="update"> update  </button>
    <button  class="action-button cancel"  data-action="cancel" > cancel </button>
    `;
  } else {
    eGui.innerHTML = `
    <button class="action-button edit"  data-action="edit" > edit  </button>
    <button class="action-button delete" data-action="delete" > delete </button>
    `;
  }

  return eGui;
};

export default ViewEmployees;
