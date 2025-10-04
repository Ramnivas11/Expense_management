import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Grid, Typography, Paper } from '@mui/material';
import SummaryCard from '../components/SummaryCard';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DashboardPage({ role }) {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = React.useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = role === 'EMPLOYEE' ? '/expenses/me/stats' : '/expenses/stats';
      const res = await API.get(endpoint);
      setStats(res.data);

      // Prepare chart data
      const data = {
        labels: ['Pending', 'Approved', 'Rejected'],
        datasets: [
          {
            label: 'Expense Status',
            data: [res.data.pending, res.data.approved, res.data.rejected],
            backgroundColor: [
              'rgba(255, 159, 64, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
              'rgba(255, 159, 64, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
      setChartData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, role]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Total Expenses"
          value={`$${stats.total.toFixed(2)}`}
          icon={<MonetizationOnIcon sx={{ fontSize: 40 }} />}
          color="#2196f3"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Pending"
          value={stats.pending}
          icon={<HourglassEmptyIcon sx={{ fontSize: 40 }} />}
           color="#ff9800"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircleOutlineIcon sx={{ fontSize: 40 }} />}
           color="#4caf50"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Rejected"
          value={stats.rejected}
          icon={<HighlightOffIcon sx={{ fontSize: 40 }} />}
           color="#f44336"
        />
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Expense Summary
          </Typography>
          {loading ? (
            <Typography>Loading chart...</Typography>
          ) : (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Expense Status Distribution',
                  },
                },
              }}
            />
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default DashboardPage;