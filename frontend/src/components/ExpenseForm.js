import React, { useState } from 'react';
import API from '../services/api';

function ExpenseForm() {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    try {
      await API.post('/expenses/submit', { amount, date, description });
      alert('Expense submitted');
    } catch (err) {
      alert('Submission failed');
    }
  };

  const handleOCRUpload = async () => {
    if (!file) return alert('Select a file');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await API.post('/ocr/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const text = res.data;
      const amtMatch = text.match(/[\d,.]+/);
      const dateMatch = text.match(/\d{4}-\d{2}-\d{2}/);
      setAmount(amtMatch ? amtMatch[0] : '');
      setDate(dateMatch ? dateMatch[0] : '');
      setDescription(text);
      alert('OCR processed, form auto-filled');
    } catch (err) {
      alert('OCR upload failed');
    }
  };

  return (
    <div className="mt-4">
      <h4>Submit Expense</h4>
      <input placeholder="Amount" className="form-control mt-2" value={amount} onChange={e => setAmount(e.target.value)} />
      <input type="date" className="form-control mt-2" value={date} onChange={e => setDate(e.target.value)} />
      <textarea placeholder="Description" className="form-control mt-2" value={description} onChange={e => setDescription(e.target.value)} />
      <input type="file" className="form-control mt-2" onChange={e => setFile(e.target.files[0])} />
      <button className="btn btn-secondary mt-2" onClick={handleOCRUpload}>Upload & OCR</button>
      <button className="btn btn-primary mt-2" onClick={handleSubmit}>Submit Expense</button>
    </div>
  );
}

export default ExpenseForm;
