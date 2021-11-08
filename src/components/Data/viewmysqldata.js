import React, { useState, useEffect, useRef } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { Link } from "react-router-dom";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import axios from "axios";
import GridOverlay from "../../UI/customoverlay";

const ViewMySqlData = () => {
  const [dataReady, setDataReady] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const BASEURL = "http://localhost:8081/api/";
  const [options, setOptions] = useState([{ key: 2021, text: 2021 }]); //;
  //let options = [];
  let years = [];
  const ref = useRef(null);

  function handleScroll(e) {
    const cY = window.scrollY;
    const tbh = ref.current.offsetHeight;
    const thresh = 1000;
    if (tbh - cY - thresh < 0) console.log("reached end");
  }
  const onGridReady = async (params) => {
    const updateData = (data) => {
      var dataSource = {
        rowCount: null,
        getRows: function (params) {
          console.log("asking for " + params.startRow + " to " + params.endRow);

          if (params.endRow > 50) {
            console.log(params.endRow);
            axios
              .get(
                "http://localhost:8080/api/getFilmsWithPagination?page=2&limit=100"
              )
              .then((res) => {
                data.push(res.data);
              })
              .catch((err) => {
                console.log(err);
              });
          }

          var rowsThisPage = data.slice(params.startRow, params.endRow);
          var lastRow = -1;
          if (data.length <= params.endRow) {
            lastRow = data.length;
          }
          params.successCallback(rowsThisPage, lastRow);
        },
      };
      params.api.setDatasource(dataSource);
    };

    const resp = await fetch(
      "http://localhost:8080/api/getFilmsWithPagination?page=1&limit=50"
    );
    const respData = await resp.json();
    updateData(respData);

    years = respData
      .map((item) => item.release_year)
      .filter((value, index, self) => self.indexOf(value) === index);

    years.map((v) =>
      setOptions((options) => [...options, { key: v, text: v }])
    );
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

  const filterData = async () => {
    console.log(selectedYear);
    const resp = await axios.get(
      BASEURL + "getFilmsByYear?year=" + selectedYear.text
    );
    const data = await resp.data;
    setRowData(data);
  };
  useEffect(() => {
    if (rowData !== null) {
      setDataReady(true);
    }
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [rowData]);

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
      }

      if (action === "update") {
        params.api.stopEditing(false);

        const contactData = {};
        contactData.Title = params.data.Title;
        contactData.id = params.data.ID;
      }

      if (action === "cancel") {
        params.api.stopEditing(true);
      }
    }
    if (action === "update") {
    }
  };
  return (
    <div className="view">
      <div>
        <Link className="ui primary button" to="/pls/add">
          + Add
        </Link>
      </div>
      <br />

      <div className="dropdown">
        <Dropdown
          placeholder="Select an option"
          label="Year"
          options={options}
          onChange={(e, selectedOption) => {
            setSelectedYear(selectedOption);
          }}
        />
        <br />
        <PrimaryButton label="Filter" onClick={filterData}>
          Filter
        </PrimaryButton>
        <br />
      </div>
      {dataReady && (
        <div
          className="ag-theme-alpine"
          style={{ height: 600, width: 1200 }}
          ref={ref}
        >
          <AgGridReact
            //rowData={rowData}

            frameworkComponents={{
              customLoadingOverlay: GridOverlay,
            }}
            loadingOverlayComponent={"customLoadingOverlay"}
            loadingOverlayComponentParams={{
              loadingMessage: "One moment please...",
            }}
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
            infiniteInitialRowCount={10}
            maxBlocksInCache={10}
            editType="fullRow"
            onCellClicked={onCellClicked}
            onRowEditingStopped={onRowEditingStopped}
            onRowEditingStarted={onRowEditingStarted}
          >
            <AgGridColumn
              field="film_id"
              headerName="ID"
              editable={false}
            ></AgGridColumn>
            <AgGridColumn
              field="title"
              headerName="Title"
              editable={true}
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

export default ViewMySqlData;