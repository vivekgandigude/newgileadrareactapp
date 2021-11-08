import { AgGridReact } from "ag-grid-react";
import React from "react";

const AGGridContainer = (
  colDef,
  rowData,
  onGridReady,
  onbodyScrollEnd,
  onCellClicked,
  onRowEditingStopped,
  onRowEditingStarted,
  sortChanged
) => {
  return (
    <div>
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
          columnDefs={colDef}
          rowData={rowData}
          onGridReady={onGridReady}
          onBodyScrollEnd={onbodyScrollEnd}
          onCellClicked={onCellClicked}
          onRowEditingStopped={onRowEditingStopped}
          onRowEditingStarted={onRowEditingStarted}
          sortingOrder={["asc", "desc"]}
          onSortChanged={sortChanged}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default AGGridContainer;
