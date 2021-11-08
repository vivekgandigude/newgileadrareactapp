import React from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const DeleteModal = ({ handleClose, show, item, close }) => {
  return (
    <div>
      <Modal show={show} onHide={close}>
        <Modal.Header>
          <Modal.Title>Do you want to delete {item.title}?</Modal.Title>
        </Modal.Header>

        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default DeleteModal;
