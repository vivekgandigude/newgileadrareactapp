import React, { useEffect, useState } from "react";

import { useSaveEmployeeMutation } from "../../services/api.services";
import { Stack, TextField } from "@fluentui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../Data/view.css";
import * as moment from "moment";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const NewEmployee = ({ handleClose, show, close }) => {
  const [addEmp, addEmpRespInfo] = useSaveEmployeeMutation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("M");

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
    if (addEmpRespInfo.isSuccess) {
      alert("Employee Added");
    }
  }, [addEmpRespInfo]);
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
      empData.gender = gender;
      debugger;
      await addEmp(empData);
      console.log(addEmpRespInfo);

      handleClose();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>New Employee</Modal.Title>
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
                  value={hireDate}
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
                  <select onChange={(e) => setGender(e.target.value)}>
                    <option value="M" selected>
                      M
                    </option>
                    <option value="F">F</option>
                  </select>
                </div>
              </Stack.Item>
            </Stack>
          </Stack>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <div className="linkButton">
          <Button variant="primary" onClick={SubmitHandler}>
            Add
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default NewEmployee;
