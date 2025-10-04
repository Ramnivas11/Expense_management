import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import API from '../services/api';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { toast } from 'react-toastify';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

function SubmitExpensePage() {
  const [form, setForm] = useState({
    amount: '',
    date: '',
    description: '',
    category: '',
  });
  const [file, setFile] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setOcrLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const res = await API.post('/ocr/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Basic parsing from OCR text - can be improved with a more structured response from backend
        const text = res.data;
        const amtMatch = text.match(/[\d,.]+/);
        const dateMatch = text.match(/\d{4}-\d{2}-\d{2}/);

        setForm(prev => ({
          ...prev,
          amount: amtMatch ? amtMatch[0].replace(',', '') : prev.amount,
          date: dateMatch ? dateMatch[0] : prev.date,
          description: text.substring(0, 255) // Limit description length
        }));
        toast.success('OCR processing complete. Please review the fields.');
      } catch (error) {
        toast.error('OCR processing failed.');
      } finally {
        setOcrLoading(false);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.date || !form.category || !form.description) {
        toast.error("All fields are required.");
        return;
    }
    setSubmitLoading(true);
    try {
        const payload = {
            ...form,
            amount: parseFloat(form.amount)
        };
        await API.post('/expenses/submit', payload);
        toast.success('Expense submitted successfully!');
        // Reset form
        setForm({ amount: '', date: '', description: '', category: '' });
        setFile(null);
    } catch (error) {
        // Error is handled by global interceptor
    } finally {
        setSubmitLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Submit a New Expense
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed grey',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isDragActive ? 'action.hover' : 'transparent',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <input {...getInputProps()} />
            {ocrLoading ? (
              <CircularProgress />
            ) : file ? (
              <Box>
                <Typography>{file.name}</Typography>
                <IconButton onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                    <DeleteIcon/>
                </IconButton>
              </Box>
            ) : (
              <Box>
                <CloudUploadIcon sx={{ fontSize: 48, mb: 2 }} />
                <Typography>Drag & drop a receipt image here, or click to select</Typography>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Amount"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="number"
              required
            />
            <TextField
              label="Date"
              name="date"
              value={form.date}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              required
            />
            <Box sx={{ mt: 2, position: 'relative' }}>
              <Button type="submit" variant="contained" fullWidth disabled={submitLoading}>
                Submit Expense
              </Button>
              {submitLoading && (
                <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }}/>
              )}
            </Box>
          </form>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default SubmitExpensePage;