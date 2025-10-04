import React, { useState, useCallback, useRef } from 'react';
import { Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import API from '../services/api';

function ExpenseForm() {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const clearForm = useCallback(() => {
    setAmount('');
    setDate('');
    setDescription('');
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('date', date);
    formData.append('description', description);
    if (file) {
      formData.append('file', file);
    }

    try {
      await API.post('/expenses/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Expense submitted successfully!');
      clearForm();
    } catch (err) {
      setError('Submission failed. Please check your input and try again.');
    }
    setLoading(false);
  }, [amount, date, description, file, clearForm]);

  const handleOCRUpload = useCallback(async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    setOcrLoading(true);
    setMessage('');
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await API.post('/ocr/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const text = res.data;
      const amtMatch = text.match(/[\d,.]+/);
      const dateMatch = text.match(/\d{4}-\d{2}-\d{2}/);
      setAmount(amtMatch ? amtMatch[0].replace(/,/g, '') : '');
      setDate(dateMatch ? dateMatch[0] : '');
      setDescription(text);
      setMessage('OCR processing complete. Please review and submit.');
    } catch (err) {
      setError('OCR upload failed. The file might be corrupted or in an unsupported format.');
    }
    setOcrLoading(false);
  }, [file]);

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5">Submit New Expense</Card.Header>
      <Card.Body>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Expense details" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Receipt (Optional)</Form.Label>
            <Form.Control type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} />
            <Button variant="secondary" className="mt-2" onClick={handleOCRUpload} disabled={ocrLoading || !file}>
              {ocrLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Upload & OCR'}
            </Button>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Submit Expense'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ExpenseForm;
