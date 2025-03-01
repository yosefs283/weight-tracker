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

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
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
                    Sign in to your account
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
                        sx={{ mb: 3 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Typography textAlign="center">
                        Don't have an account?{' '}
                        <MuiLink component={Link} to="/signup">
                            Sign Up
                        </MuiLink>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}

export default Login; 