import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import {
    alpha,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Menu,
    Paper,
    Switch,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { POS_GET, POS_POST, POS_PUT, POS_DELETE } from '../../../website/service/ApiService';
import { Calendar, EditIcon, MoreVerticalIcon, Trash2Icon } from 'lucide-react';
import { StyleColors } from '../../../website/extension/Extension';
import MenuItem from '@mui/material/MenuItem';
import TextField from '../../../website/components/text_field/POSTextField';

const CategoriesTable = ({ refresh }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        description: '',
        status: true,
        image: null
    });

    const handleClick = (event, category) => {
        setAnchorEl(event.currentTarget);
        setSelectedCategory(category);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        if (selectedCategory) {
            setEditFormData({
                name: selectedCategory.name,
                description: selectedCategory.description,
                status: selectedCategory.status === "true",
                image: selectedCategory.image
            });
            setEditDialogOpen(true);
        }
        handleClose();
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
        handleClose();
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleEditSubmit = () => {
        const updatedData = {
            ...editFormData,
            status: editFormData.status.toString()
        };

        const res = POS_PUT(`v1/categories/${selectedCategory.id}`, updatedData);
        res.then(r => {
            fetchCategories();
            handleEditDialogClose();
        }).catch(e => {
            console.error('Error updating category:', e);
        });
    };

    const handleDeleteSubmit = () => {
        const res = POS_DELETE(`v1/categories/${selectedCategory.id}`);
        res.then(r => {
            fetchCategories();
            handleDeleteDialogClose();
        }).catch(e => {
            console.error('Error deleting category:', e);
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    const handleStatusChange = (e) => {
        setEditFormData({
            ...editFormData,
            status: e.target.checked
        });
    };

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await POS_GET('v1/categories');
            if (res.success) {
                setCategories(res.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [refresh]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

    const columns = [
        {
            field: 'name',
            headerName: 'Category Name',
            flex: 1,
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {params.row.image && (
                        <Avatar
                            className='p-2 shadow-md'
                            src={params.row.image}
                            alt={params.row.name}
                            style={{ width: 40, height: 40, marginRight: 10 }}
                        />
                    )}
                    {params.value}
                </div>
            )
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 1.5,
            renderCell: (params) => (
                <Box className='start h-100'>
                    <Typography variant="body2" noWrap>
                        {params.value || '-'}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.5,
            renderCell: (params) => (
                <Switch
                    checked={params.value === "true"}
                    color="primary"
                    readOnly
                />
            )
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            flex: 0.8,
            renderCell: (params) => (
                <Box height='100%' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={16} color={theme.palette.text.secondary} />
                    <Typography variant="body2" color="text.secondary">
                        {formatDate(params.value)}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'action',
            headerName: 'Actions',
            flex: 0.5,
            sortable: false,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="text"
                        startIcon={<MoreVerticalIcon />}
                        onClick={(e) => handleClick(e, params.row)}
                        sx={{
                            fontSize: StyleColors.fontSmall,
                            color: StyleColors.componentsColor,
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.04)'
                            }
                        }}
                    />
                    <Menu
                        elevation={1}
                        anchorEl={anchorEl}
                        open={open && selectedCategory?.id === params.row.id}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleEditClick}>
                            <EditIcon size={16} style={{ marginRight: 8 }} />
                            Edit
                        </MenuItem>
                        <MenuItem onClick={handleDeleteClick}>
                            <Trash2Icon size={16} style={{ marginRight: 8 }} />
                            Delete
                        </MenuItem>
                    </Menu>
                </div>
            )
        },
    ];

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className='overflow-x-auto'>
            <Box sx={{ minWidth: 992 }}>
                <DataGrid

                    sx={{
                        border: '0.5px solid rgba(189, 189, 189, 0.9)',
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            borderRadius: '16px 16px 0 0',
                            '& .MuiDataGrid-columnHeader': {
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                color: theme.palette.text.primary,
                                '&:focus': {
                                    outline: 'none'
                                }
                            }
                        },
                        '& .MuiDataGrid-cell': {

                            '&:focus': {
                                outline: 'none'
                            }
                        },
                        '& .MuiDataGrid-row': {

                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.02),

                            },
                            '&:nth-of-type(even)': {
                                backgroundColor: alpha(theme.palette.action.hover, 0.02)
                            }
                        },

                    }}
                    rows={categories}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    pagination
                    disableSelectionOnClick
                    getRowId={(row) => row.id}
                />
            </Box>

            {/* Edit Category Dialog */}
            <Dialog open={editDialogOpen} onClose={handleEditDialogClose} fullScreen={fullScreen}>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogContent>
                    <DialogContentText className='py-3 pt-0'>
                        {selectedCategory && `Editing: ${selectedCategory.name}`}
                    </DialogContentText>
                    <TextField
                        label="Category Name"
                        name="name"
                        type="text"
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        name="description"
                        type="text"
                        value={editFormData.description}
                        onChange={handleEditFormChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <Box display="flex" alignItems="center" mt={2}>
                        <Switch
                            checked={editFormData.status}
                            onChange={handleStatusChange}
                            color="primary"
                        />
                        <Typography ml={1}>
                            {editFormData.status ? 'Active' : 'Inactive'}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose}>Cancel</Button>
                    <Button onClick={handleEditSubmit} color="primary">Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {selectedCategory && `Are you sure you want to delete "${selectedCategory.name}"? This action cannot be undone.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                    <Button onClick={handleDeleteSubmit} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CategoriesTable;