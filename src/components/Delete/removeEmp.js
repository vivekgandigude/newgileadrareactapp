import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { Stack, TextField } from "@fluentui/react";
import { PrimaryButton } from "@fluentui/react";
import * as moment from "moment";
import {
  useDeleteEmployeeMutation,
  useGetEmployeeDetailsQuery,
} from "../../services/api-services";
import axios from "axios";
import "../Data/view.css";
const BASEURL = "http://localhost:8081/api/";
const RemoveEmp = () => {
  const [delEmp, delRespInfo] = useDeleteEmployeeMutation();
  const history = useHistory();
  const qp = useParams("id");
  console.log(qp);
  const empDetails = useGetEmployeeDetailsQuery(qp.id);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const formatDate = (date) => {
    console.log(moment(date).format("yyyy-MM-DD"));
    return moment(date).format("yyyy-MM-DD");
  };
  const fetchEmpDetails = async () => {
    const response = await axios.get(
      BASEURL + "getEmployeeDetails?id=" + qp.id
    );
    const data = await response.data;
    console.log(data);
    setFirstName(data[0].first_name);
    setLastName(data[0].last_name);
    setHireDate(formatDate(data[0].hire_date));
    setDob(formatDate(data[0].birth_date));
    setGender(data[0].gender);
  };
  useEffect(() => {
  
    if (empDetails.isSuccess) {
      console.log(empDetails.data);
      const data = empDetails.data;
      setFirstName(data[0].first_name);
      setLastName(data[0].last_name);
      setHireDate(formatDate(data[0].hire_date));
      setDob(formatDate(data[0].birth_date));
      setGender(data[0].gender);
    }
  }, [empDetails]);

  const removeEmployee = async () => {
    await delEmp(qp.id);
    //const response = await deletEmp.data;
    console.log(delRespInfo);
    alert("Employee Deleted!");
    history.push("/employees");
  };
  return (
    <div className="view">
      <h3>Remove</h3>
      <div>
        <div className="newemp">
          <Stack>
            <Stack>
              <Stack.Item grow>
                <TextField
                  placeholder="First Name"
                  label="First Name"
                  value={firstName}
                  name="firstName"
                  disabled={true}
                />
                <TextField
                  placeholder="Last Name"
                  label="Last Name"
                  value={lastName}
                  name="lastName"
                  disabled={true}
                />
                <TextField
                  placeholder="Hire Date"
                  label="Hire Date"
                  value={hireDate}
                  name="hireDate"
                  disabled={true}
                />
                <TextField
                  placeholder="Date of Birth"
                  label="Date of Birth"
                  value={dob}
                  name="dob"
                  disabled={true}
                />
                <TextField
                  placeholder="Gender"
                  label="Gender"
                  value={gender}
                  name="gender"
                  disabled={true}
                />
              </Stack.Item>
              <br />
              <div className="deleteButton">
                <PrimaryButton onClick={removeEmployee}>Delete</PrimaryButton>
              </div>
            </Stack>
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default RemoveEmp;
