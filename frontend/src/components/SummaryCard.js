import React from 'react';
import { Card, Typography, Box } from '@mui/material';

function SummaryCard({ title, value, icon, color }) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: color }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </Box>
      <Box>
        {icon}
      </Box>
    </Card>
  );
}

export default SummaryCard;