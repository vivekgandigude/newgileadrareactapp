import React, { useEffect, useState } from "react";
import {
  useGetEmployeeDetailsQuery,
  useUpdateEmployeeMutation,
} from "../../services/api-services";
import { Stack, TextField } from "@fluentui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../Data/view.css";
import * as moment from "moment";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
const UpdateEmployee = ({ item, handleClose, show, close }) => {
  const empDetails = useGetEmployeeDetailsQuery(item.id);
  const [updateEmpDetails, respInfo] = useUpdateEmployeeMutation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("M");
  const options = ["M", "F"];
  const formatDate = (date) => {
    console.log(moment(date).format("yyyy-MM-DD"));
    return moment(date).format("yyyy-MM-DD");
  };
  const addYears = (date, years) => {
    var d = date.getDate();
    date.setYear(date.getMonth() + +years);
    if (date.getDate() !== d) {
      date.setDate(0);
    }
    return date;
  };

  useEffect(() => {
    if (empDetails.isSuccess && empDetails.data !== undefined) {
      setFirstName(empDetails.data[0].first_name);
      setLastName(empDetails.data[0].last_name);
      var selectedDate = new Date(empDetails.data[0].HireDate);
      setHireDate(selectedDate);
      selectedDate = new Date(empDetails.data[0].birth_date);
      setDob(selectedDate);
      setGender(empDetails.data[0].gender);
    }
  }, [empDetails]);
  const SubmitHandler = async () => {
    const empData = {};

    try {
      var hireDateFormatted = formatDate(hireDate);
      var dobFormatted = formatDate(dob);
      empData.empno = item.id;
      empData.firstname = firstName;
      empData.lastname = lastName;
      empData.hireDate = hireDateFormatted;
      empData.dob = dobFormatted;
      empData.gender = gender;
      debugger;
      await updateEmpDetails(empData);
      console.log(respInfo);
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };
  const onGenderSelectionChange = (option) => {
    const selectedGender = option.value;
    setGender(selectedGender);
  };
  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Employee Details </Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
                <label>Hire Date</label>
                <DatePicker
                  selected={hireDate}
                  // value={hireDate}
                  onChange={(date) => setHireDate(date)}
                  minDate={addYears(new Date(), -30)}
                  maxDate={new Date()}
                  showDisabledMonthNavigation
                />
                <label>Date of Birth</label>
                <DatePicker
                  selected={dob}
                  value={hireDate}
                  onChange={(date) => setDob(date)}
                  minDate={addYears(new Date(), -70)}
                  maxDate={new Date()}
                  showDisabledMonthNavigation
                />
                <div className="dropdown">
                  <label>Select Gender</label>
                  <br />
                  <Dropdown
                    options={options}
                    onChange={onGenderSelectionChange}
                    value={gender}
                    selected={gender}
                    placeholder="Select an option"
                  />
                </div>
              </Stack.Item>
            </Stack>
          </Stack>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Cancel
        </Button>
        <div className="linkButton">
          <Button variant="primary" onClick={SubmitHandler}>
            Update
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateEmployee;
