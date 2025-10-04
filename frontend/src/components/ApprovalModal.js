import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';

function ApprovalModal({ open, onClose, onConfirm, action }) {
  const [comment, setComment] = useState('');

  const handleConfirm = () => {
    onConfirm(comment);
    setComment('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm {action}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please provide a comment for this action.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="comment"
          label="Comment"
          type="text"
          fullWidth
          variant="standard"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm}>{action}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ApprovalModal;