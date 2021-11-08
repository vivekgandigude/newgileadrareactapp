import React, { useEffect } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { useGetEmployeesQuery } from "../../services/api-services";
import axios from "axios";
import * as moment from "moment";

const BASEURL = "http://localhost:8081/api/";

const AllEmpData = () => {
  const loadData = useGetEmployeesQuery();
  const onGridReady = async (params) => {
    const updateData = (data) => {
      var fakeServer = createFakeServer(data);
      var datasource = createServerSideDatasource(fakeServer);
      params.api.setServerSideDatasource(datasource);
    };

    const resp = await fetch(BASEURL + "getEmployees");
    const respData = await resp.json();
    updateData(respData);
  };
 
  function createServerSideDatasource(server) {
    return {
      getRows: function (params) {
        console.log("[Datasource] - rows requested by grid: ", params.request);
        var response = server.getData(params.request);
        setTimeout(function () {
          if (response.success) {
            params.success({ rowData: response.rows });
          } else {
            params.fail();
          }
        }, 500);
      },
    };
  }
  function createFakeServer(allData) {
    return {
      getData: function (request) {
        var requestedRows = allData.slice();
        return {
          success: true,
          rows: requestedRows,
        };
      },
    };
  }
  const dateValueFormat = (data) => {
    return moment(data.value).format("MM/DD/yyyy");
  };
  return (
    <div>
      <br />
      <div>
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
          </AgGridReact>
        </div>
      </div>
    </div>
  );
};

export default AllEmpData;
