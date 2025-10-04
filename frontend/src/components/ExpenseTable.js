import React from 'react';
import { Box, Button, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const getStatusChip = (status) => {
    const statusColors = {
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'error',
    };
    return <Chip label={status} color={statusColors[status] || 'default'} size="small" />;
};


const columns = (role, onAction) => {
  const baseColumns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'employeeName', headerName: 'Employee', width: 150, flex: 1 },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      width: 110,
      renderCell: (params) => `$${params.value.toFixed(2)}`,
    },
    { field: 'date', headerName: 'Date', width: 130 },
    { field: 'description', headerName: 'Description', width: 250, flex: 2 },
    {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: (params) => getStatusChip(params.value),
    },
  ];

  if (role === 'MANAGER' || role === 'ADMIN') {
    return [
      ...baseColumns,
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        width: 220,
        renderCell: (params) => {
          return (
            params.row.status === 'PENDING' && (
              <Box>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => onAction(params.row.id, 'APPROVE')}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => onAction(params.row.id, 'REJECT')}
                >
                  Reject
                </Button>
              </Box>
            )
          );
        },
      },
    ];
  }

  return baseColumns;
};

function ExpenseTable({ expenses, role, onAction, loading }) {
  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={expenses}
        columns={columns(role, onAction)}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableSelectionOnClick
        loading={loading}
        autoHeight
      />
    </Box>
  );
}

export default ExpenseTable;