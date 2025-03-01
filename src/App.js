import React, { createContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import WeightTracker from './components/WeightTracker';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import * as db from './services/db';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SnackbarProvider } from 'notistack';

export const ColorModeContext = createContext({
    toggleColorMode: () => { },
    mode: 'light'
});

function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
}

// Create a wrapper component to handle user preferences
function AppContent() {
    const [mode, setMode] = useState('light');
    const { user } = useAuth();

    useEffect(() => {
        async function loadUserPreferences() {
            if (user) {
                try {
                    const userProfile = await db.getUserProfile(user.uid);
                    if (userProfile?.darkMode !== undefined) {
                        setMode(userProfile.darkMode ? 'dark' : 'light');
                    }
                } catch (error) {
                    console.error('Error loading user preferences:', error);
                }
            }
        }
        loadUserPreferences();
    }, [user]);

    const colorMode = useMemo(
        () => ({
            mode,
            toggleColorMode: (newMode) => {
                setMode(newMode || (prevMode => prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [mode],
    );

    const getTheme = (mode) => createTheme({
        palette: {
            mode,
            primary: {
                main: '#007AFF', // iOS blue
                light: '#5856D6',
                dark: '#0062CC',
            },
            secondary: {
                main: '#5856D6', // iOS purple
            },
            success: {
                main: '#34C759', // iOS green
            },
            error: {
                main: '#FF3B30', // iOS red
            },
            background: {
                default: mode === 'light' ? '#F2F2F7' : '#000000',
                paper: mode === 'light' ? '#FFFFFF' : '#1C1C1E',
            },
        },
        shape: {
            borderRadius: 10,
        },
        typography: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            h4: {
                fontWeight: 600,
            },
            h6: {
                fontWeight: 600,
            },
        },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        boxShadow: mode === 'light'
                            ? '0px 2px 8px rgba(0, 0, 0, 0.05)'
                            : '0px 2px 8px rgba(0, 0, 0, 0.2)',
                    }
                }
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        borderRadius: 8,
                        fontWeight: 600,
                        padding: '10px 20px',
                    },
                    contained: {
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: 'none',
                        }
                    }
                }
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 8,
                        }
                    }
                }
            },
            MuiBottomNavigation: {
                styleOverrides: {
                    root: {
                        height: 64,
                        backgroundColor: mode === 'light' ? '#FFFFFF' : '#1C1C1E',
                        borderTop: `1px solid ${mode === 'light' ? '#E5E5EA' : '#38383A'}`,
                    }
                }
            },
            MuiBottomNavigationAction: {
                styleOverrides: {
                    root: {
                        padding: '6px 0',
                        minWidth: 64,
                    }
                }
            },
        },
    });

    const theme = useMemo(
        () => getTheme(mode),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Box sx={{ maxWidth: 'sm', mx: 'auto', px: 2 }}>
                                    <WeightTracker />
                                </Box>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

function App() {
    useEffect(() => {
        // Set meta tags programmatically
        document.title = 'Weight Tracker';

        // Add viewport meta tag
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(viewport);

        // Add theme-color meta tag
        const themeColor = document.createElement('meta');
        themeColor.name = 'theme-color';
        themeColor.content = '#007AFF';
        document.head.appendChild(themeColor);

        // Add apple-mobile-web-app meta tags
        const appleCapable = document.createElement('meta');
        appleCapable.name = 'apple-mobile-web-app-capable';
        appleCapable.content = 'yes';
        document.head.appendChild(appleCapable);

        const appleStatusBar = document.createElement('meta');
        appleStatusBar.name = 'apple-mobile-web-app-status-bar-style';
        appleStatusBar.content = 'black-translucent';
        document.head.appendChild(appleStatusBar);

        // Cleanup function
        return () => {
            document.head.removeChild(viewport);
            document.head.removeChild(themeColor);
            document.head.removeChild(appleCapable);
            document.head.removeChild(appleStatusBar);
        };
    }, []);

    return (
        <AuthProvider>
            <SnackbarProvider
                maxSnack={3}
                autoHideDuration={3000}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <AppContent />
                </LocalizationProvider>
            </SnackbarProvider>
        </AuthProvider>
    );
}

export default App; 