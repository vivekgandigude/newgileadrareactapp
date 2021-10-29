import React, { useState } from "react";
import { Stack, TextField } from "@fluentui/react";
import { PrimaryButton } from "@fluentui/react";
import axios from "axios";

const NewEmp = (props) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  //const [submitteData, setSubmitteData] = useState(props.isSubmitted);

  const handleInputChange = (event) => {
    const { name } = event.target;
    setUser({ ...user, [name]: event.target.value });
  };
  const SubmitHandler = async () => {
    const contactData = {};
    try {
      contactData.firstname = user.firstName;
      contactData.lastname = user.lastName;
      contactData.phone = user.phone;
      contactData.email = user.email;
      const postData = await axios.post(
        "http://localhost:8080/api/saveContact",
        contactData
      );
      const response = await postData.data;
      console.log(response);
      props.submitteData("submitted");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      
      <Stack>
        <Stack>
          <Stack.Item grow>
            <TextField
              placeholder="First Name"
              label="First Name"
              value={user.firstName}
              name="firstName"
              onChange={handleInputChange}
            />
            <TextField
              placeholder="Last Name"
              label="Last Name"
              value={user.lastName}
              name="lastName"
              onChange={handleInputChange}
            />
            <TextField
              placeholder="Email"
              label="Email"
              value={user.email}
              name="email"
              onChange={handleInputChange}
            />
            <TextField
              placeholder="Phone"
              label="Phone"
              value={user.phone}
              name="phone"
              onChange={handleInputChange}
            />
          </Stack.Item>
          <br />
          <PrimaryButton onClick={SubmitHandler}>Add</PrimaryButton>
        </Stack>
      </Stack>
    </div>
  );
};

export default NewEmp;
