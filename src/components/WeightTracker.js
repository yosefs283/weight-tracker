import React, { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Box,
    Tabs,
    Tab,
    BottomNavigation,
    BottomNavigationAction,
    CircularProgress
} from '@mui/material';
import {
    ListAlt as LogIcon,
    Timeline as GraphIcon,
    CalculateOutlined as BmiIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import WeightLog from './WeightLog';
import WeightGraph from './WeightGraph';
import BmiCalculator from './BmiCalculator';
import Settings from './Settings';
import WeightGoals from './WeightGoals';
import * as storage from '../services/storage';
import { useAuth } from '../contexts/AuthContext';
import * as db from '../services/db';
import { useSnackbar } from 'notistack';
import { useSwipeable } from 'react-swipeable';

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index} style={{ padding: '0 0 56px 0' }}>
            {value === index && children}
        </div>
    );
}

function WeightTracker() {
    const { user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const [tab, setTab] = useState(0);
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [height, setHeight] = useState('');
    const [goal, setGoal] = useState(null);

    useEffect(() => {
        async function loadData() {
            if (!user) {
                setEntries([]);
                setHeight('');
                return;
            }

            try {
                setIsLoading(true);
                const savedEntries = await db.getAllEntries(user.uid);
                setEntries(savedEntries || []);

                const userProfile = await db.getUserProfile(user.uid);
                if (userProfile?.height) {
                    setHeight(userProfile.height);
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                setEntries([]);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [user]);

    useEffect(() => {
        async function loadUserProfile() {
            if (user) {
                try {
                    const profile = await db.getUserProfile(user.uid);
                    if (profile?.weightGoal) {
                        setGoal(profile.weightGoal);
                    }
                } catch (error) {
                    console.error('Error loading user profile:', error);
                }
            }
        }
        loadUserProfile();
    }, [user]);

    const handleAddEntry = async (newEntry) => {
        if (!user) return;

        try {
            const savedEntry = await db.addEntry(newEntry, user.uid);
            setEntries(prev => {
                const newEntries = [...prev, savedEntry];
                return newEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
            });
        } catch (error) {
            console.error('Error adding entry:', error);
        }
    };

    const handleUpdateEntry = async (updatedEntry) => {
        try {
            await db.updateEntry(updatedEntry.id, updatedEntry);
            setEntries(prev => {
                const newEntries = prev.map(entry =>
                    entry.id === updatedEntry.id ? updatedEntry : entry
                );
                return newEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
            });
        } catch (error) {
            console.error('Error updating entry:', error);
        }
    };

    const handleDeleteEntry = async (entryId) => {
        try {
            await db.deleteEntry(entryId);
            setEntries(prev => prev.filter(entry => entry.id !== entryId));
            return true;
        } catch (error) {
            throw error;
        }
    };

    const handleHeightChange = async (newHeight) => {
        try {
            if (!user) return;

            setHeight(newHeight);
            await db.updateUserProfile(user.uid, {
                height: newHeight,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating height:', error);
        }
    };

    const handleGoalUpdate = async (newGoal) => {
        try {
            await db.updateUserGoal(user.uid, newGoal);
            setGoal(newGoal);
            enqueueSnackbar('Weight goal updated successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to update weight goal', { variant: 'error' });
        }
    };

    const handleSwipe = (direction) => {
        if (direction === 'LEFT') {
            setTab(prev => Math.min(prev + 1, 3));
        } else if (direction === 'RIGHT') {
            setTab(prev => Math.max(prev - 1, 0));
        }
    };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => handleSwipe('LEFT'),
        onSwipedRight: () => handleSwipe('RIGHT'),
        preventScrollOnSwipe: true,
        trackMouse: false
    });

    return (
        <Box sx={{ pb: 7, position: 'relative', minHeight: '100vh' }}>
            <div {...swipeHandlers}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h4" gutterBottom>
                                Weight Tracker
                            </Typography>
                        </Paper>

                        <TabPanel value={tab} index={0}>
                            <WeightGoals
                                entries={entries}
                                goal={goal}
                                onGoalUpdate={handleGoalUpdate}
                            />
                            <WeightLog
                                entries={entries}
                                onAddEntry={handleAddEntry}
                                onUpdateEntry={handleUpdateEntry}
                                onDeleteEntry={handleDeleteEntry}
                            />
                        </TabPanel>

                        <TabPanel value={tab} index={1}>
                            <WeightGraph entries={entries} />
                        </TabPanel>

                        <TabPanel value={tab} index={2}>
                            <BmiCalculator
                                entries={entries}
                                height={height}
                            />
                        </TabPanel>

                        <TabPanel value={tab} index={3}>
                            <Settings
                                height={height}
                                onHeightChange={handleHeightChange}
                            />
                        </TabPanel>
                    </>
                )}
            </div>

            <Paper
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1100,
                }}
                elevation={3}
            >
                <BottomNavigation
                    value={tab}
                    onChange={(event, newValue) => {
                        setTab(newValue);
                    }}
                    showLabels
                >
                    <BottomNavigationAction label="Log" icon={<LogIcon />} />
                    <BottomNavigationAction label="Graph" icon={<GraphIcon />} />
                    <BottomNavigationAction label="BMI" icon={<BmiIcon />} />
                    <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
                </BottomNavigation>
            </Paper>
        </Box>
    );
}

export default WeightTracker; 