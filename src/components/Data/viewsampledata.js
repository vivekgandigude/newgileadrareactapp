import React, { useEffect, useState, useRef } from "react";
import { useGetAllEmployeesQuery } from "../../services/api-services";
import DataTable from "react-data-table-component";
import "./view.css";
import listOperations from "../../services/crud";
const ViewSampleData = () => {
  const queryparams = {
    page: 1,
    limit: 5,
  };
  const columns = [
    {
      name: "ID",
      selector: (row) => row.emp_no,
      sortable: true,
    },
    {
      name: "First Name",
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.last_name,
      sortable: true,
    },
  ];
  const employeeData = useGetAllEmployeesQuery(queryparams);
  const [lastElement, setLastElement] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [gridData, setGridData] = useState([]);
  const TOTAL_PAGES = 3;
  const [pageNum, setPageNum] = useState(1);
  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        console.log(first);
        setPageNum((no) => no + 1);
      }
    })
  );
  useEffect(() => {
    if (employeeData.isSuccess) {
      setDataReady(true);
      setRowData(employeeData.data);

      setGridData(employeeData.data);
      console.log(gridData);
    }
  }, [employeeData, gridData]);
  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;
    debugger;
    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement]);
  useEffect(() => {
    debugger;
    if (pageNum <= TOTAL_PAGES) {
      loadMore();
    }
  }, [pageNum]);

  const [dataReady, setDataReady] = useState(false);
  
  const loadMore = async () => {
    const data = await listOperations.geAllEmp(pageNum, 10);
    setRowData(...rowData, data);
    let all = new Set([...gridData, ...data]);
    setGridData(...all);

    console.log(gridData);
  };

  return (
    <div className="view">
      <h1>Data</h1>
      {dataReady && (
        <div ref={lastElement}>
          <DataTable
            columns={columns}
            data={rowData}
            highlightOnHover
          ></DataTable>
        </div>
      )}
      <div>
        <p>load</p>
      </div>
    </div>
  );
};

export default ViewSampleData;
