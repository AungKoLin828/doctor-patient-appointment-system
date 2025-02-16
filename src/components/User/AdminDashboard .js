import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import '../Common.css';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [userCounts, setUserCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        //const response = await axios.get('http://localhost:5000/api/admin/user-usage');
        const response = await axios.get('/api/admin/user-usage');
        if (Array.isArray(response.data)) {
          setUserCounts(response.data);
        } else {
          setError('Unexpected data format');
        }
        setLoading(false);
      } catch (error) {
        setError('Error fetching user counts');
        setLoading(false);
      }
    };

    fetchUserCounts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  // Prepare data for the graph
  const labels = userCounts.map(user => user.name);
  const counts = userCounts.map(user => user.count);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'User Count',
        backgroundColor: ['#4CAF50', '#2196F3'],
        borderColor: ['#388E3C', '#1976D2'],
        borderWidth: 1,
        hoverBackgroundColor: ['#66BB6A', '#42A5F5'],
        hoverBorderColor: ['#388E3C', '#1976D2'],
        data: counts,
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="chart-container">
        <Bar
          data={chartData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                },
              },
            },
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;