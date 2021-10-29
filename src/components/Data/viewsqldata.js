import React, { useEffect, useState } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import "./view.css";
import ErrorBoundary from "../Error/error-boundary";
import NewEmp from "../Create/New/newemp";
import axios from "axios";
import * as moment from "moment";
const quarterlyOptions = [
  {
    key: "Q1",
    text: "Q1",
  },
  { key: "Q2", text: "Q2" },
  {
    key: "Q3",
    text: "Q3",
  },
  {
    key: "Q4",
    text: "Q4",
  },
];
const ViewSQLData = () => {
  const BASEURL = "http://localhost:8080/api/";
  // const listData = useGetContactsQuery();
  const [rowData, setRowData] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState("not submitted");
  const [options, setOptions] = useState([{ key: 2021, text: 2021 }]); //;
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  let years = [];
  const [showNewEmp, setShowNewEmp] = useState(false);
  const [hasError, setError] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  useEffect(() => {
    if (isSubmitted === "submitted") setShowNewEmp(false);
    if (rowData !== null) setDataReady(true);
  }, [isSubmitted, rowData]);

  const onRowEditingStarted = (params) => {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true,
    });
  };

  const onGridReady = async (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    const updateData = (data) => {
      setRowData(data);
    };

    const resp = await axios.get(BASEURL + "getContacts");
    const data = await resp.data;
    updateData(data);
    years = data
      .map((item) => item.HiringYear)
      .filter((value, index, self) => self.indexOf(value) === index);

    years.map((v) => {
      if (v !== 2021) {
        setOptions((options) => [...options, { key: v, text: v }]);
        return true;
      } else return false;
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
        params.api.applyTransaction({
          remove: [params.node.data],
        });
        try {
          fetch(BASEURL + "deleteEmployee?id=" + params.data.employee_id, {
            method: "DELETE",
          }).then((status) => console.log(status));
        } catch (err) {
          console.log(err);
        }
      }

      if (action === "update") {
        try {
          params.api.stopEditing(false);
          const contactData = {};
          contactData.firstname = params.data.first_name;
          contactData.lastname = params.data.last_name;
          contactData.phone = params.data.phone_number;
          contactData.email = params.data.email;
          contactData.contactId = params.data.employee_id;

          await axios
            .post(
              BASEURL + "updateEmpDetails?id=" + params.data.employee_id,
              contactData
            )
            .then((status) => console.log(status));
        } catch (err) {
          console.log(err);
          setError(true);
        }
      }

      if (action === "cancel") {
        params.api.stopEditing(true);
      }
    }
  };
  const valueSetter = (params) => {
    debugger;
    params.data.first_name = params.newValue;
    return true;
  };
  const valueGetter = (params) => {
    return params.data.first_name;
  };
  const addEmployee = () => {
    //history.push("/");
    setShowNewEmp(true);
  };
  const filterData = async () => {
    console.log(selectedYear);
    let sm = "";
    let em = "";
    switch (selectedQuarter.text) {
      case "Q1":
        sm = 1;
        em = 3;
        break;
      case "Q2":
        sm = 4;
        em = 6;
        break;
      case "Q3":
        sm = 7;
        em = 9;
        break;
      case "Q4":
        sm = 10;
        em = 12;
        break;
      default:
        break;
    }
    const resp = await axios.get(
      BASEURL +
        "getEmployeesByYearQuarter?year=" +
        selectedYear.text +
        "&startmonth=" +
        sm +
        "&endmonth=" +
        em
    );
    const data = await resp.data;
    setRowData(data);
  };
  const dateValueFormat = (data) => {
    return moment(data.hire_date).format("MM/DD/YYYY");
  };
  if (hasError) {
    return <p>Sorry, update failed!</p>;
  } else {
    return (
      <div className="view">
        <div>
          <PrimaryButton text=" + ADD" onClick={addEmployee} />
        </div>
        <div className="dropdown">
          <Dropdown
            placeholder="Select an option"
            label="Year"
            options={options}
            onChange={(e, selectedOption) => {
              setSelectedYear(selectedOption);
            }}
          />
          <Dropdown
            placeholder="Select an option"
            label="Month"
            options={quarterlyOptions}
            onChange={(e, selectedOption) => {
              setSelectedQuarter(selectedOption);
            }}
          />
          <br />
          <PrimaryButton label="Filter" onClick={filterData}>
            Filter
          </PrimaryButton>
          <br />
        </div>
        <div>
          {showNewEmp && (
            <NewEmp submitteData={(data) => setIsSubmitted(data)}></NewEmp>
          )}
        </div>
        <p>Data source = MS SQL </p>

        <ErrorBoundary>
          {dataReady && (
            <div
              className="ag-theme-alpine"
              style={{ height: 600, width: 1200 }}
            >
              <AgGridReact
                //rowData={listData.data}
                rowData={rowData}
                onGridReady={onGridReady}
                pagination={true}
                enableRangeSelection={true}
                paginationPageSize="50"
                defaultColDef={{
                  flex: 1,
                  minWidth: 110,
                  editable: true,
                  resizable: true,
                  sortable: true,
                }}
                editType="fullRow"
                onCellClicked={onCellClicked}
                onRowEditingStopped={onRowEditingStopped}
                onRowEditingStarted={onRowEditingStarted}
              >
                <AgGridColumn
                  field="employee_id"
                  headerName="ID"
                  editable={false}
                ></AgGridColumn>

                <AgGridColumn
                  field="first_name"
                  headerName="First Name"
                  // editable={true}
                  valueSetter={valueSetter}
                  valueGetter={valueGetter}
                ></AgGridColumn>
                <AgGridColumn
                  field="last_name"
                  headerName="Last Name"
                  editable={true}
                ></AgGridColumn>
                <AgGridColumn
                  field="email"
                  headerName="Email"
                  editable={true}
                ></AgGridColumn>
                <AgGridColumn
                  field="hire_date"
                  valueFormatter={dateValueFormat}
                  headerName="Hiring Date"
                  editable={true}
                ></AgGridColumn>
                <AgGridColumn
                  cellRenderer={actionCellRender}
                  colId="action"
                  minWidth="150"
                  headerName="Actions"
                  editable={false}
                ></AgGridColumn>
              </AgGridReact>
            </div>
          )}
        </ErrorBoundary>
      </div>
    );
  }
};
const actionCellRender = (params) => {
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
export default ViewSQLData;
