
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ApprovalModal({ show, onHide, onSubmit, action }) {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit(comment);
    setComment('');
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{action} Expense</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Enter comment for ${action.toLowerCase()}`}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant={action === 'APPROVE' ? 'success' : 'danger'} onClick={handleSubmit}>
          {action}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ApprovalModal;
