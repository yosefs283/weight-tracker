import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    Link as MuiLink
} from '@mui/material';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            await signup(email, password);
            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper sx={{ p: 4, maxWidth: 400, width: '90%' }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Weight Tracker
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }} textAlign="center" color="text.secondary">
                    Create your account
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        sx={{ mb: 3 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Typography textAlign="center">
                        Already have an account?{' '}
                        <MuiLink component={Link} to="/login">
                            Sign In
                        </MuiLink>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}

export default Signup; 