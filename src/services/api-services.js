import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dataApi = createApi({
  reducerPath: "dataApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8081/api/",
  }),
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: () => ({
        url: "getEmployees",
        method: "GET",
      }),
    }),
    getEmployeeDetails: builder.query({
      query: (id) => {
        console.log("ID w:", id);
        return {
          url: "getEmployeeDetails?id=" + id,
          method: "GET",
        };
      },
    }),
    saveEmployee: builder.mutation({
      query: (contact) => {
        return {
          url: `saveEmployee`,
          method: "POST",
          body: contact,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    updateEmployee: builder.mutation({
      query: (updateListData) => {
        console.log("hi");
        const { id, ...data } = updateListData;
        console.log(data);
        return {
          url: `updateEmployee?id=${updateListData.id}`,
          method: "POST",
          body: updateListData,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    deleteEmployee: builder.mutation({
      query: (id) => {
        console.log("Delete ID:", id);
        return {
          url: `deleteEmployee?id=${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeDetailsQuery,
  useSaveEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = dataApi;
