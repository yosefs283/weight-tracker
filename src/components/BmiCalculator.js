import React from 'react';
import {
    Typography,
    Box,
    Paper,
    Grid,
    LinearProgress,
    Chip
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Timeline as TimelineIcon,
    Info as InfoIcon
} from '@mui/icons-material';

const BMI_RANGES = [
    {
        range: '< 18.5',
        category: 'Underweight',
        description: 'May indicate malnutrition or other health problems',
        color: '#FFA726'
    },
    {
        range: '18.5 - 24.9',
        category: 'Normal Weight',
        description: 'Generally good overall health indicators',
        color: '#66BB6A'
    },
    {
        range: '25.0 - 29.9',
        category: 'Overweight',
        description: 'May increase risk of health problems',
        color: '#FFA726'
    },
    {
        range: '≥ 30',
        category: 'Obese',
        description: 'Increased risk of several health conditions',
        color: '#EF5350'
    }
];

function BmiCalculator({ entries, height }) {
    const calculateBMI = (weight) => {
        if (!height || !weight) return null;
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    };

    const getBmiCategory = (bmi) => {
        if (!bmi) return { label: '', color: 'default' };
        if (bmi < 18.5) return { label: 'Underweight', color: '#FFA726' };
        if (bmi < 25) return { label: 'Normal weight', color: '#66BB6A' };
        if (bmi < 30) return { label: 'Overweight', color: '#FFA726' };
        return { label: 'Obese', color: '#EF5350' };
    };

    const latestWeight = entries[0]?.weight;
    const currentBmi = calculateBMI(latestWeight);
    const bmiCategory = getBmiCategory(currentBmi);

    const getBmiProgress = (bmi) => {
        if (!bmi) return 0;
        return ((bmi - 15) / (35 - 15)) * 100;
    };

    const stats = {
        currentWeight: latestWeight || '-',
        lowestWeight: entries.length ? Math.min(...entries.map(e => e.weight)) : '-',
        highestWeight: entries.length ? Math.max(...entries.map(e => e.weight)) : '-',
        averageWeight: entries.length
            ? (entries.reduce((sum, e) => sum + e.weight, 0) / entries.length).toFixed(1)
            : '-',
        weightChange: entries.length > 1
            ? (entries[0].weight - entries[entries.length - 1].weight).toFixed(1)
            : null
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                {currentBmi ? (
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography variant="h3" color="primary" gutterBottom>
                            {currentBmi}
                        </Typography>
                        <Chip
                            label={bmiCategory.label}
                            sx={{
                                bgcolor: bmiCategory.color,
                                color: 'white',
                                fontSize: '1rem',
                                py: 1
                            }}
                        />
                    </Box>
                ) : (
                    <Typography color="text.secondary" textAlign="center">
                        {!height ? 'Set your height in Settings to calculate BMI' : 'Add a weight entry to calculate BMI'}
                    </Typography>
                )}

                <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography color="text.secondary">Underweight</Typography>
                        <Typography color="text.secondary">Normal</Typography>
                        <Typography color="text.secondary">Overweight</Typography>
                        <Typography color="text.secondary">Obese</Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={getBmiProgress(currentBmi)}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: bmiCategory.color
                            }
                        }}
                    />
                </Box>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <InfoIcon sx={{ mr: 1 }} />
                    BMI Categories
                </Typography>
                <Grid container spacing={2}>
                    {BMI_RANGES.map((item) => (
                        <Grid item xs={12} key={item.category}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    bgcolor: theme => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                                    borderLeft: 4,
                                    borderColor: item.color,
                                    borderRadius: 1
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {item.category}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        BMI: {item.range}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {item.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimelineIcon sx={{ mr: 1 }} />
                    Weight Statistics
                </Typography>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                        <Typography color="text.secondary">Current</Typography>
                        <Typography variant="h6">{stats.currentWeight} kg</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography color="text.secondary">Average</Typography>
                        <Typography variant="h6">{stats.averageWeight} kg</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography color="text.secondary">Lowest</Typography>
                        <Typography variant="h6" color="success.main">
                            {stats.lowestWeight} kg
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography color="text.secondary">Highest</Typography>
                        <Typography variant="h6" color="error.main">
                            {stats.highestWeight} kg
                        </Typography>
                    </Grid>
                    {stats.weightChange !== null && (
                        <Grid item xs={12}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: stats.weightChange > 0 ? 'error.main' : 'success.main'
                            }}>
                                {stats.weightChange > 0 ? (
                                    <TrendingUpIcon sx={{ mr: 1 }} />
                                ) : (
                                    <TrendingDownIcon sx={{ mr: 1 }} />
                                )}
                                <Typography variant="h6">
                                    {Math.abs(stats.weightChange)} kg
                                    {stats.weightChange > 0 ? ' gained' : ' lost'}
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Box>
    );
}

export default BmiCalculator; 