import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Chip,
    Divider
} from '@mui/material';
import {
    Edit as EditIcon,
    Flag as FlagIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

function WeightGoals({ entries, goal, onGoalUpdate }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newGoal, setNewGoal] = useState(goal || '');

    const currentWeight = entries[0]?.weight || 0;
    const isGainGoal = goal > currentWeight;
    const remainingKg = goal ? Math.abs(currentWeight - goal).toFixed(1) : 0;

    return (
        <Paper sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            backgroundColor: theme => theme.palette.mode === 'light'
                ? '#FFFFFF'
                : '#1C1C1E'
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
                pb: 2,
                borderBottom: 1,
                borderColor: 'divider'
            }}>
                <FlagIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                <Typography
                    variant="h6"
                    sx={{
                        flex: 1,
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: 'text.primary'
                    }}
                >
                    Weight Goal
                </Typography>
                <IconButton
                    onClick={() => setIsDialogOpen(true)}
                    size="small"
                    sx={{
                        bgcolor: theme => theme.palette.mode === 'light'
                            ? 'rgba(0, 122, 255, 0.1)'
                            : 'rgba(88, 86, 214, 0.1)',
                        '&:hover': {
                            bgcolor: theme => theme.palette.mode === 'light'
                                ? 'rgba(0, 122, 255, 0.15)'
                                : 'rgba(88, 86, 214, 0.15)'
                        },
                        '&:active': {
                            bgcolor: theme => theme.palette.mode === 'light'
                                ? 'rgba(0, 122, 255, 0.2)'
                                : 'rgba(88, 86, 214, 0.2)'
                        }
                    }}
                >
                    <EditIcon
                        fontSize="small"
                        sx={{ color: 'primary.main' }}
                    />
                </IconButton>
            </Box>

            {goal ? (
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {goal} kg
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Current: {currentWeight} kg
                            </Typography>
                        </Box>
                        <Chip
                            icon={isGainGoal ? <TrendingUpIcon /> : <TrendingDownIcon />}
                            label={`${remainingKg} kg to ${isGainGoal ? 'gain' : 'lose'}`}
                            color={remainingKg === '0.0' ? "success" : "primary"}
                            variant="outlined"
                            sx={{
                                fontWeight: 'medium',
                                fontSize: '1rem',
                                py: 2
                            }}
                        />
                    </Box>
                </Box>
            ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography color="text.secondary" gutterBottom>
                        Set a weight goal to track your progress
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => setIsDialogOpen(true)}
                        startIcon={<FlagIcon />}
                    >
                        Set Goal
                    </Button>
                </Box>
            )}

            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle>Set Weight Goal</DialogTitle>
                <Divider />
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        label="Goal Weight (kg)"
                        type="number"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        fullWidth
                        inputProps={{ step: "0.1", min: "0" }}
                        autoFocus
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Current weight: {currentWeight} kg
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1 }}>
                    <Button onClick={() => setIsDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onGoalUpdate(parseFloat(newGoal));
                            setIsDialogOpen(false);
                        }}
                        variant="contained"
                        disabled={!newGoal}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}

export default WeightGoals; 