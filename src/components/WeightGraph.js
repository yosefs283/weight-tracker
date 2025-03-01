import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import {
    Typography,
    Box,
    ToggleButtonGroup,
    ToggleButton,
    Paper,
    Grid,
    Chip
} from '@mui/material';
import {
    Timeline as TimelineIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

function WeightGraph({ entries }) {
    const [timeRange, setTimeRange] = useState('all');

    const calculateStats = (filteredEntries) => {
        if (!filteredEntries.length) return null;

        const weights = filteredEntries.map(e => e.weight);
        const firstWeight = filteredEntries[filteredEntries.length - 1].weight;
        const lastWeight = filteredEntries[0].weight;
        const change = lastWeight - firstWeight;

        return {
            change: change.toFixed(1),
            average: (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1),
            isGain: change > 0
        };
    };

    const filterEntriesByRange = (entries, range) => {
        if (range === 'all') return entries;

        const now = new Date();
        const ranges = {
            'week': 7,
            'month': 30,
            '3months': 90
        };

        const daysAgo = ranges[range];
        const cutoffDate = new Date(now.setDate(now.getDate() - daysAgo));

        return entries.filter(entry => new Date(entry.date) >= cutoffDate);
    };

    const sortedEntries = filterEntriesByRange([...entries], timeRange)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const stats = calculateStats(sortedEntries);

    const handleRangeChange = (event, newRange) => {
        if (newRange !== null) {
            setTimeRange(newRange);
        }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        {new Date(label).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        }).replace(/\//g, '.')}
                    </Typography>
                    <Typography variant="h6" color="primary">
                        {payload[0].value} kg
                    </Typography>
                </Paper>
            );
        }
        return null;
    };

    return (
        <>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TimelineIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="h6" color="primary">
                        Weight Progress
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <ToggleButtonGroup
                        value={timeRange}
                        exclusive
                        onChange={handleRangeChange}
                        aria-label="time range"
                        size="small"
                    >
                        <ToggleButton value="week">Last Week</ToggleButton>
                        <ToggleButton value="month">Last Month</ToggleButton>
                        <ToggleButton value="3months">Last 3 Months</ToggleButton>
                        <ToggleButton value="all">All Time</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {stats && (
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6}>
                            <Chip
                                icon={stats.isGain ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                label={`${stats.change} kg change`}
                                color={stats.isGain ? "error" : "success"}
                                variant="outlined"
                                sx={{ width: '100%' }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Chip
                                label={`${stats.average} kg average`}
                                variant="outlined"
                                sx={{ width: '100%' }}
                            />
                        </Grid>
                    </Grid>
                )}

                <Box sx={{ height: 300 }}>
                    {sortedEntries.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sortedEntries}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(date) => {
                                        const d = new Date(date);
                                        return d.toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit'
                                        }).replace(/\//g, '.');
                                    }}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    label={{
                                        value: 'Weight (kg)',
                                        angle: -90,
                                        position: 'insideLeft'
                                    }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#007AFF"
                                    dot={{ fill: '#007AFF' }}
                                    strokeWidth={2}
                                />
                                {sortedEntries.length > 1 && (
                                    <ReferenceLine
                                        stroke="#666"
                                        strokeDasharray="3 3"
                                        segment={[
                                            { x: sortedEntries[0].date, y: sortedEntries[0].weight },
                                            { x: sortedEntries[sortedEntries.length - 1].date, y: sortedEntries[sortedEntries.length - 1].weight }
                                        ]}
                                    />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <Typography color="text.secondary" align="center">
                            No data available for the selected time range
                        </Typography>
                    )}
                </Box>
            </Paper>
        </>
    );
}

export default WeightGraph; 