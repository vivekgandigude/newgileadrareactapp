import React, { useState, useEffect } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import DeleteModal from "../Modal/deletemodal";
import NewSalesRecord from "../Create/newsalesrecord";
import { Button } from "react-bootstrap";
import {
  useUpdateSalesRecordMutation,
  useDeleteSalesRecordMutation,
} from "../../services/api.services";
import listOperations from "../../services/crud.service";
import dexieIndexedDb from "../../services/dexie.indexeddb";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "./view.css";
const LIMIT = 100;
let page = 1;
let column = "ID";
let order = "asc";
let sortState;
let propertyNames;
let filterColumn = "";
let filterText = "";
const Viewsales = () => {
  const [updateSalesRecord, updateRespInfo] = useUpdateSalesRecordMutation();
  const [deleteSalesRecord, deleteRespInfo] = useDeleteSalesRecordMutation();
  const [showModal, setShowModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [show, setShow] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [hasError, setHasError] = useState(false);
  const [item, setItem] = useState({
    title: "",
    id: "",
  });

  const onGridReady = async (params) => {
    var offset;
    try {
      const datasource = {
        getRows(params) {
          if (page === 1 && sortState === undefined && filterText === "") {
            listOperations
              .getSalesData(LIMIT)
              .then((response) => {
                if (params.endRow >= 100) {
                  page = params.endRow / 100;
                  page++;
                }
                params.successCallback(response.results, response.lastRow);
              })
              .catch((error) => {
                console.error(error);
                params.failCallback();
                setHasError(true);
              });
          }
          if (
            page > 1 &&
            (propertyNames === undefined || propertyNames.length === 0)
          ) {
            offset = (page - 1) * 100;
            dexieIndexedDb
              .getListDatasortByColumn(offset, LIMIT, column, order)
              .then((data) => {
                page++;
                params.successCallback(data, data.lastRow);
              })
              .catch((error) => {
                console.error(error);
                params.failCallback();
                setHasError(true);
              });
          }
          if (page === 1 && sortState !== undefined && filterText === "") {
            offset = 0;
            dexieIndexedDb
              .getListDatasortByColumn(offset, LIMIT, column, order)
              .then((data) => {
                page++;
                params.successCallback(data, data.lastRow);
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
              .getFilteredListDataByColumn(
                page,
                LIMIT,
                filterText,
                filterColumn
              )
              .then((data) => {
                if (data !== undefined && data.length > 0) {
                  page++;
                  var lastrow;
                  if (data.length > 100) lastrow = data.length;
                  else lastrow = data.lastRow;
                  params.successCallback(data, lastrow);
                } else {
                  params.successCallback(null, 0);
                }
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
      setHasError(false);
    } catch (err) {
      console.log(err);
      setHasError(true);
    }
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
    } catch (err) {
      console.log(err);
    }
  };
  const onColumnFilter = async (params) => {
    var filterModel = params.api.getFilterModel();
    propertyNames = Object.keys(filterModel);
    page = 1;
    if (propertyNames.length > 0) {
      switch (propertyNames[propertyNames.length - 1]) {
        case "Title":
          filterColumn = "Title";
          filterText = filterModel.Title.filter;
          break;
        case "ID":
          filterColumn = "ID";
          filterText = filterModel.ID.filter;
          break;
        case "field_1":
          filterColumn = "field_1";
          filterText = filterModel.field_1.filter;
          break;
        case "field_2":
          filterColumn = "field_2";
          filterText = filterModel.field_2.filter;
          break;
        case "field_3":
          filterColumn = "field_3";
          filterText = filterModel.field_3.filter;
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
            title: params.data.Title,
            id: params.data.ID,
          });
        }
        if (action === "update") {
          params.api.stopEditing(false);
          const salesData = {};
          salesData.id = params.data.ID;
          salesData.title = params.data.Title;
          salesData.country = params.data.field_1;
          salesData.itemtype = params.data.field_2;
          salesData.saleschannel = params.data.field_3;

          var p = Promise.all([
            dexieIndexedDb.udpdatesListItem(salesData.id, salesData),
            updateSalesRecord(salesData),
          ]);
          console.log(p);
        }

        if (action === "cancel") {
          params.api.stopEditing(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const hideModal = async () => {
    setShow(false);
    Promise.all([
      await deleteSalesRecord(item.id),
      await dexieIndexedDb.deleteListItem(item.id),
    ]);
    window.location.reload();
  };
  const hideNewModal = async () => {
    setShowNew(false);
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

  useEffect(() => {
    if (updateRespInfo.isSuccess) {
      alert("Sales record updated");
    }
    if (deleteRespInfo.isSuccess) {
      alert("Sales record deleted!");
    }
  }, [updateRespInfo, deleteRespInfo]);
  if (hasError) {
    return <p>Sorry, Something went wrong!</p>;
  } else {
    return (
      <div className="view">
        <div className="paddingDiv">
          <Button onClick={showNewEmp}> + Add Employee</Button>
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
            <NewSalesRecord
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
            onFilterChanged={onColumnFilter}
            onGridReady={onGridReady}
          >
            <AgGridColumn
              field="ID"
              headerName="ID"
              minWidth={50}
              editable={false}
            ></AgGridColumn>
            <AgGridColumn
              field="Title"
              headerName="Title"
              editable={true}
              //colId="Title"
              filterParams={{
                filterOptions: ["equals", "contains"],
                suppressAndOrCondition: true,
              }}
            ></AgGridColumn>
            <AgGridColumn
              field="field_1"
              headerName="Country"
              editable={true}
            ></AgGridColumn>
            <AgGridColumn
              field="field_3"
              headerName="Sales Channel"
              editable={true}
            ></AgGridColumn>
            <AgGridColumn
              field="field_2"
              headerName="Item Type"
              editable={true}
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
export default Viewsales;
