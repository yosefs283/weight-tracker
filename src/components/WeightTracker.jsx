import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Grid
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function WeightTracker() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [weightHistory, setWeightHistory] = useState([]);
  const [bmi, setBmi] = useState(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedWeightHistory = localStorage.getItem('weightHistory');
    const savedHeight = localStorage.getItem('height');
    
    if (savedWeightHistory) {
      setWeightHistory(JSON.parse(savedWeightHistory));
    }
    if (savedHeight) {
      setHeight(savedHeight);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('weightHistory', JSON.stringify(weightHistory));
    localStorage.setItem('height', height);
  }, [weightHistory, height]);

  const handleWeightSubmit = (e) => {
    e.preventDefault();
    if (weight) {
      const newEntry = {
        weight: parseFloat(weight),
        date: new Date().toISOString().split('T')[0]
      };
      setWeightHistory([...weightHistory, newEntry]);
      setWeight('');
      calculateBMI(parseFloat(weight), parseFloat(height));
    }
  };

  const calculateBMI = (weight, height) => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      setBmi(bmiValue);
    }
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const chartData = {
    labels: weightHistory.map(entry => entry.date),
    datasets: [
      {
        label: 'Weight Progress',
        data: weightHistory.map(entry => entry.weight),
        fill: false,
        borderColor: '#007AFF',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Weight Tracker
      </Typography>

      <Grid container spacing={3}>
        {/* Weight Input Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <form onSubmit={handleWeightSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Height (cm)"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Weight (kg)"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    type="submit"
                    sx={{ mt: 1 }}
                  >
                    Log Weight
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* BMI Section */}
        {bmi && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                BMI Information
              </Typography>
              <Typography variant="body1">
                Your BMI: {bmi.toFixed(1)}
              </Typography>
              <Typography variant="body1">
                Category: {getBMICategory(bmi)}
              </Typography>
            </Paper>
          </Grid>
        )}

        {/* Graph Section */}
        {weightHistory.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Weight Progress
              </Typography>
              <Line data={chartData} options={chartOptions} />
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default WeightTracker; 