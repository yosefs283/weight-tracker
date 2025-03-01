import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper,
    Typography,
    TextField,
    Switch,
    Box,
    Button,
    CircularProgress
} from '@mui/material';
import { ColorModeContext } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { Logout as LogoutIcon } from '@mui/icons-material';
import * as db from '../services/db';

function Settings({ height, onHeightChange }) {
    const { toggleColorMode, mode } = useContext(ColorModeContext);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleHeightChange = (e) => {
        const value = e.target.value;
        if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 300)) {
            onHeightChange(value);
        }
    };

    const handleDarkModeChange = async (event) => {
        try {
            const newMode = event.target.checked ? 'dark' : 'light';
            toggleColorMode(newMode);
            if (user) {
                await db.updateUserProfile(user.uid, {
                    darkMode: event.target.checked
                });
            }
        } catch (error) {
            console.error('Error updating dark mode:', error);
        }
    };

    return (
        <>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom color="primary">
                    Profile Settings
                </Typography>
                <TextField
                    type="number"
                    label="Height (cm)"
                    value={height}
                    onChange={handleHeightChange}
                    fullWidth
                    sx={{ mb: 2 }}
                    inputProps={{ step: "1", min: "0", max: "300" }}
                    helperText="Your height is used to calculate BMI"
                />
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom color="primary">
                    Appearance
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography>Dark Mode</Typography>
                    <Switch
                        checked={mode === 'dark'}
                        onChange={handleDarkModeChange}
                    />
                </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary">
                    Account
                </Typography>
                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                >
                    Sign Out
                </Button>
            </Paper>
        </>
    );
}

export default Settings; 