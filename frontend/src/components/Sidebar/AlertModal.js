import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import { Box } from '@chakra-ui/react';


const AlertModal = (props) => {
  return (
    <Modal show={props.showAtt} onHide={props.handleCloseAtt} centered style={{backdropFilter: "blur(10px)"}} animation={false} >
      <Modal.Header closeButton>
        <Modal.Title style={{ textAlign: "center", width: "100%" }}>
          Discard post?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}>       
          <Box>If you leave, your edits won't be saved.</Box>
      </Modal.Body>
      <Modal.Footer
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }} 
      >
        <Button variant="secondary" onClick={props.Cancel}>Cancel</Button>
        <Button variant="danger" onClick={props.Discard}>Discard</Button>
      </Modal.Footer>
    </Modal>
  );
  
}

export default AlertModal