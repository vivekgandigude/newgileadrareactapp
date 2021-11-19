import React, { useEffect, useState } from "react";
import { useAddSalesRecordMutation } from "../../services/api.services";
import { Stack, TextField } from "@fluentui/react";
import "react-datepicker/dist/react-datepicker.css";
import "../Data/view.css";
import { Modal, Button } from "react-bootstrap";
import dexieIndexedDb from "../../services/dexie.indexeddb";
import "bootstrap/dist/css/bootstrap.min.css";

const NewSalesRecord = ({ handleClose, show, close }) => {
  const [addSalesRecord, respInfo] = useAddSalesRecordMutation();
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [itemType, setItemType] = useState("");
  const [salesChannel, setSalesChannel] = useState("");

  useEffect(() => {}, []);
  const SubmitHandler = async () => {
    const empData = {};

    try {
      empData.title = title;
      empData.country = country;
      empData.itemtype = itemType;
      empData.saleschannel = salesChannel;

      const newItem = await addSalesRecord(empData);
      if (newItem.data) {
        await dexieIndexedDb.addListItem(newItem.data.ID, empData);
      }
      console.log(newItem);
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (respInfo.isSuccess) {
      alert("Sales record Added");
    }
  }, [respInfo]);
  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>New Sales Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="newemp">
          <Stack>
            <Stack>
              <Stack.Item grow>
                <TextField
                  placeholder="Title"
                  label="Title"
                  value={title}
                  name="title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                  placeholder="Country"
                  label="Country"
                  value={country}
                  name="country"
                  onChange={(e) => setCountry(e.target.value)}
                />
                <TextField
                  placeholder="Item Type"
                  label="Item Type"
                  value={itemType}
                  name="itemType"
                  onChange={(e) => setItemType(e.target.value)}
                />
                <TextField
                  placeholder="Sales Channel"
                  label="Sales Channel"
                  value={salesChannel}
                  name="salesChannel"
                  onChange={(e) => setSalesChannel(e.target.value)}
                />
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

export default NewSalesRecord;
