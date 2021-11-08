import React, { useEffect, useState, useRef } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { useGetAllEmployeesQuery } from "../../services/api-services";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import "./view.css";
import ErrorBoundary from "../Error/error-boundary";
import NewEmp from "../Create/New/newemp";
import axios from "axios";

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
  const listData = useGetAllEmployeesQuery();
  const ref = useRef(null);

  const [rowData, setRowData] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState("not submitted");
  const options = [{ key: 2021, text: 2021 }]; 
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");

  const [showNewEmp, setShowNewEmp] = useState(false);
  const [hasError, setError] = useState(false);

  useEffect(() => {
    if (isSubmitted === "submitted") setShowNewEmp(false);
    if (listData.isSuccess) {
      setDataReady(true);
      setRowData(listData.data);
    }
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [isSubmitted, listData]);

  function handleScroll(e) {
    const cY = window.scrollY;
    const tbh = ref.current.offsetHeight;
    const thresh = 1000;
    debugger;
    if (tbh - cY - thresh < 0) {
      console.log("reached end");
    }
  }
 

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
              ref={ref}
              className="ag-theme-alpine"
              style={{ height: 600, width: 1200 }}
            >
              <AgGridReact
                rowData={rowData}
                //rowData={rowData}
                //onGridReady={onGridReady}

                enableRangeSelection={true}
                defaultColDef={{
                  flex: 1,
                  minWidth: 110,
                  editable: true,
                  resizable: true,
                  sortable: true,
                }}
              >
                <AgGridColumn
                  field="emp_no"
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
              </AgGridReact>
            </div>
          )}
        </ErrorBoundary>
      </div>
    );
  }
};

export default ViewSQLData;
