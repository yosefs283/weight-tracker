import React, { useState } from 'react';
import {
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondary,
    Box,
    Typography,
    Paper,
    Divider,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Menu,
    MenuItem,
    CircularProgress,
    Backdrop
} from '@mui/material';
import {
    Add as AddIcon,
    MoreVert as MoreIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ListAlt as ListAltIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    TrendingFlat as TrendingFlatIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSnackbar } from 'notistack';

function WeightLog({ entries, onAddEntry, onUpdateEntry, onDeleteEntry }) {
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);

    const formatDateForDisplay = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '.');
    };

    const [weight, setWeight] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [editingEntry, setEditingEntry] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Add validation constants
    const WEIGHT_LIMITS = {
        MIN: 20, // Minimum realistic weight in kg
        MAX: 300, // Maximum realistic weight in kg
        MAX_CHANGE: 20 // Maximum realistic weight change between entries in kg
    };

    const validateWeight = (newWeight, isNewEntry = true) => {
        const weightNum = parseFloat(newWeight);

        // Basic range validation
        if (weightNum < WEIGHT_LIMITS.MIN) {
            return `Weight cannot be less than ${WEIGHT_LIMITS.MIN}kg`;
        }
        if (weightNum > WEIGHT_LIMITS.MAX) {
            return `Weight cannot exceed ${WEIGHT_LIMITS.MAX}kg`;
        }

        // Check for realistic weight changes
        if (entries.length > 0 && isNewEntry) {
            const lastWeight = entries[0].weight;
            const change = Math.abs(weightNum - lastWeight);

            if (change > WEIGHT_LIMITS.MAX_CHANGE) {
                return `Weight change of ${change.toFixed(1)}kg seems unrealistic. Please verify.`;
            }
        }

        return null; // No validation errors
    };

    const handleWeightChange = (e) => {
        const newWeight = e.target.value;
        // Allow empty value or numbers with up to one decimal place
        if (newWeight === '' || /^\d*\.?\d{0,1}$/.test(newWeight)) {
            setWeight(newWeight);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (weight && date) {
            const validationError = validateWeight(weight);
            if (validationError) {
                enqueueSnackbar(validationError, { variant: 'warning' });
                return;
            }

            try {
                await onAddEntry({
                    weight: parseFloat(weight),
                    date: date
                });
                enqueueSnackbar('Entry added successfully', { variant: 'success' });
                setWeight('');
                setDate(new Date().toISOString().split('T')[0]);
            } catch (error) {
                enqueueSnackbar('Failed to add entry', { variant: 'error' });
            }
        }
    };

    const handleMenuOpen = (event, entry) => {
        setAnchorEl(event.currentTarget);
        setSelectedEntry(entry);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        setEditingEntry(selectedEntry);
        setWeight(selectedEntry.weight.toString());
        setDate(selectedEntry.date);
        setIsEditDialogOpen(true);
        handleMenuClose();
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (editingEntry && weight && date) {
            const validationError = validateWeight(weight, false);
            if (validationError) {
                enqueueSnackbar(validationError, { variant: 'warning' });
                return;
            }

            try {
                await onUpdateEntry({
                    ...editingEntry,
                    weight: parseFloat(weight),
                    date
                });
                enqueueSnackbar('Entry updated successfully', { variant: 'success' });
                setIsEditDialogOpen(false);
                setEditingEntry(null);
            } catch (error) {
                enqueueSnackbar('Failed to update entry', { variant: 'error' });
            }
        }
    };

    const handleDeleteClick = () => {
        handleMenuClose();
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedEntry) {
            return;
        }

        try {
            setIsLoading(true);
            const entryToDelete = selectedEntry;
            await onDeleteEntry(entryToDelete.id);
            enqueueSnackbar('Entry deleted successfully', { variant: 'success' });

            setIsDeleteDialogOpen(false);
            setSelectedEntry(null);
            handleMenuClose();
        } catch (error) {
            enqueueSnackbar('Failed to delete entry', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const getWeightTrend = (currentEntry, index, entries) => {
        if (index === entries.length - 1) return null; // First entry (oldest)
        const nextEntry = entries[index + 1];
        const difference = currentEntry.weight - nextEntry.weight;

        if (Math.abs(difference) < 0.1) {
            return {
                icon: <TrendingFlatIcon sx={{ color: 'text.secondary' }} />,
                difference: 0
            };
        }

        return {
            icon: difference > 0 ? (
                <TrendingUpIcon sx={{ color: 'error.main' }} />
            ) : (
                <TrendingDownIcon sx={{ color: 'success.main' }} />
            ),
            difference: Math.abs(difference)
        };
    };

    return (
        <>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom color="primary">
                    Add New Entry
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            type="number"
                            label="Weight (kg)"
                            value={weight}
                            onChange={handleWeightChange}
                            fullWidth
                            required
                            inputProps={{
                                step: "0.1",
                                min: WEIGHT_LIMITS.MIN,
                                max: WEIGHT_LIMITS.MAX
                            }}
                            helperText={`Enter weight between ${WEIGHT_LIMITS.MIN}-${WEIGHT_LIMITS.MAX}kg`}
                        />
                        <DatePicker
                            label="Date"
                            value={new Date(date)}
                            onChange={(newDate) => {
                                if (newDate) {
                                    setDate(newDate.toISOString().split('T')[0]);
                                }
                            }}
                            format="dd.MM.yyyy"
                            maxDate={new Date()}
                            slotProps={{
                                textField: {
                                    required: true,
                                    fullWidth: true,
                                }
                            }}
                        />
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        startIcon={isLoading ? <CircularProgress size={20} /> : <AddIcon />}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add Entry'}
                    </Button>
                </Box>
            </Paper>

            <Paper sx={{ p: 0, overflow: 'hidden' }}>
                <Box
                    sx={{
                        p: 2,
                        backgroundColor: theme => theme.palette.mode === 'light'
                            ? 'grey.50'
                            : 'rgba(255, 255, 255, 0.05)',
                        borderBottom: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.primary',
                        }}
                    >
                        <ListAltIcon sx={{ mr: 1 }} />
                        History
                    </Typography>
                </Box>
                <List sx={{ p: 0 }}>
                    {entries.map((entry, index) => {
                        const trend = getWeightTrend(entry, index, entries);

                        return (
                            <ListItem
                                key={entry.id}
                                divider
                                sx={{
                                    py: 2,
                                    px: 3,
                                    '&:active': {
                                        backgroundColor: theme => theme.palette.action.selected,
                                    }
                                }}
                                secondaryAction={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {trend && (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mr: 2,
                                                    typography: 'body2',
                                                    backgroundColor: theme => theme.palette.mode === 'light'
                                                        ? 'rgba(0, 0, 0, 0.04)'
                                                        : 'rgba(255, 255, 255, 0.08)',
                                                    borderRadius: 4,
                                                    px: 1.5,
                                                    py: 0.5,
                                                }}
                                            >
                                                {trend.icon}
                                                {trend.difference > 0 && (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            ml: 0.5,
                                                            fontWeight: 500,
                                                            color: trend.difference > 0 ?
                                                                'error.main' : 'success.main'
                                                        }}
                                                    >
                                                        {trend.difference.toFixed(1)} kg
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                        <IconButton
                                            edge="end"
                                            onClick={(e) => handleMenuOpen(e, entry)}
                                            sx={{
                                                color: 'text.secondary',
                                                '&:active': {
                                                    backgroundColor: 'action.selected',
                                                }
                                            }}
                                        >
                                            <MoreIcon />
                                        </IconButton>
                                    </Box>
                                }
                            >
                                <ListItemText
                                    primary={
                                        <Typography
                                            variant="h6"
                                            color="primary"
                                            sx={{
                                                fontSize: '1.25rem',
                                                fontWeight: 600,
                                                mb: 0.5
                                            }}
                                        >
                                            {entry.weight} kg
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ fontSize: '0.875rem' }}
                                        >
                                            {formatDateForDisplay(entry.date)}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        );
                    })}
                </List>
                {entries.length === 0 && (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            No entries yet. Add your first weight entry above!
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Edit Dialog */}
            <Dialog
                open={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        width: '90%',
                        maxWidth: 400,
                        m: 2,
                        p: 1
                    }
                }}
                BackdropProps={{
                    sx: {
                        backgroundColor: theme =>
                            theme.palette.mode === 'light'
                                ? 'rgba(0, 0, 0, 0.5)'
                                : 'rgba(0, 0, 0, 0.8)'
                    }
                }}
            >
                <DialogTitle sx={{
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    pb: 1
                }}>
                    Edit Entry
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Box component="form" onSubmit={handleEditSubmit} sx={{ pt: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField
                                type="number"
                                label="Weight (kg)"
                                value={weight}
                                onChange={handleWeightChange}
                                fullWidth
                                required
                                inputProps={{
                                    step: "0.1",
                                    min: WEIGHT_LIMITS.MIN,
                                    max: WEIGHT_LIMITS.MAX
                                }}
                                helperText={`Enter weight between ${WEIGHT_LIMITS.MIN}-${WEIGHT_LIMITS.MAX}kg`}
                            />
                            <DatePicker
                                label="Date"
                                value={new Date(date)}
                                onChange={(newDate) => {
                                    if (newDate) {
                                        setDate(newDate.toISOString().split('T')[0]);
                                    }
                                }}
                                format="dd.MM.yyyy"
                                maxDate={new Date()}
                                slotProps={{
                                    textField: {
                                        required: true,
                                        fullWidth: true,
                                    }
                                }}
                            />
                        </Box>
                        <DialogActions>
                            <Button
                                onClick={() => setIsEditDialogOpen(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save'}
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Menu for Edit/Delete */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEditClick}>
                    <EditIcon sx={{ mr: 1 }} fontSize="small" />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                    <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
                    Delete
                </MenuItem>
            </Menu>

            {/* Update Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onClose={() => !isLoading && setIsDeleteDialogOpen(false)}
                disableEscapeKeyDown={isLoading}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this weight entry?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setIsDeleteDialogOpen(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default WeightLog; 