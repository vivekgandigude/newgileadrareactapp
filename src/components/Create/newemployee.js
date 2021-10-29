import React, { useState } from "react";
import { useHistory } from "react-router";
import { useSaveEmployeeMutation } from "../../services/api-services";
import { Stack, TextField } from "@fluentui/react";
import { PrimaryButton, DatePicker } from "@fluentui/react";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
//import axios from "axios";
import "../Data/view.css";
import * as moment from "moment";
//const BASEURL = "http://localhost:8081/api/";
const options = [
  { key: "M", text: "M" },
  { key: "F", text: "F" },
];
const NewEmployee = () => {
  const history = useHistory();
  const [addEmp, addEmpRespInfo] = useSaveEmployeeMutation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const formatDate = (date) => {
    console.log(moment(date).format("yyyy-MM-DD"));
    return moment(date).format("yyyy-MM-DD");
  };
  const SubmitHandler = async () => {
    const empData = {};
    const min = 5000000;
    const max = 9000000;
    const rand = min + Math.random() * (max - min);
    try {
      var hireDateFormatted = formatDate(hireDate);
      var dobFormatted = formatDate(dob);
      empData.empno = Math.round(rand);
      empData.firstname = firstName;
      empData.lastname = lastName;
      empData.hireDate = hireDateFormatted;
      empData.dob = dobFormatted;
      empData.gender = gender.text;
      await addEmp(empData);
      // const postData = await axios.post(BASEURL + "saveEmployee", empData);
      // const response = await postData.data;
      console.log(addEmpRespInfo);
      alert("Employee Added");
      history.push("/employees");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="newemp">
      <Stack>
        <Stack>
          <Stack.Item grow>
            <TextField
              placeholder="First Name"
              label="First Name"
              value={firstName}
              name="firstName"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              placeholder="Last Name"
              label="Last Name"
              value={lastName}
              name="lastName"
              onChange={(e) => setLastName(e.target.value)}
            />
            <DatePicker
              placeholder="Hire date..."
              ariaLabel="Select a date"
              value={hireDate}
              label="Hire Date"
              onSelectDate={(date) => setHireDate(date)}
            />
            <DatePicker
              placeholder="Date of birth..."
              ariaLabel="Select a date"
              value={dob}
              label="Date of Birth"
              onSelectDate={(date) => setDob(date)}
            />
            <Dropdown
              placeholder="Select an option"
              label="Gender"
              options={options}
              onChange={(e, selectedOption) => {
                setGender(selectedOption);
              }}
            ></Dropdown>
          </Stack.Item>
          <br />
          <div className="linkButton">
          <PrimaryButton onClick={SubmitHandler}>Add</PrimaryButton>
          </div>
        </Stack>
      </Stack>
    </div>
  );
};

export default NewEmployee;
