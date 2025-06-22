import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { alpha, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Menu, Typography, useMediaQuery, useTheme } from '@mui/material';
import { POS_GET, POS_POST } from '../../../website/service/ApiService';
import { EditIcon, MoreVerticalIcon } from 'lucide-react';
import { StyleColors } from '../../../website/extension/Extension';
import MenuItem from '@mui/material/MenuItem';
import TextField from '../../../website/components/text_field/POSTextField';
const ProductTable = ({ refresh }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [stockDialogOpen, setStockDialogOpen] = useState(false);
    const [stockAmount, setStockAmount] = useState('');
    const handleClick = (event, product) => {
        setAnchorEl(event.currentTarget);
        setSelectedProduct(product);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleAddStockClick = () => {
        setStockDialogOpen(true);
        handleClose();
    };

    const handleStockDialogClose = () => {
        setStockDialogOpen(false);
        setStockAmount('');
    };
    const [stockNumber, setNumberStock] = useState(0);

    const handleStockSubmit = () => {
        const body = {
            "warehouse_id": "123e4567-e89b-12d3-a456-426614174000",
            "product_id": selectedProduct.product_id,
            "transaction_type": "IN",
            "quantity": Number(stockNumber),
        }
        console.log(body);
        const res = POS_POST('stock-transaction', body);
        res.then(r => {
            fetchProducts();
        }).catch(e => {
            console.log(e);
        })

        handleStockDialogClose();
    };
    const fetchProducts = async () => {
        try {
            const res = await POS_GET('v1/products');
            if (res.success) {
                setProducts(res.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, [refresh]);

    const columns = [
        {
            field: 'product_name',
            headerName: 'Product Name',
            flex: 1,
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={params.row.image_url}
                        alt={params.row.product_name}
                        style={{ width: 40, height: 40, borderRadius: 4, marginRight: 10 }}
                    />
                    {params.value}
                </div>
            )
        },
        { field: 'code', headerName: 'Product Code', flex: 0.8 },
        {
            field: 'brand_name',
            headerName: 'Brand',
            flex: 0.7,
            renderCell: (params) => params.value || '-'
        },
        {
            field: 'cost_price',
            headerName: 'Cost Price',
            flex: 0.7,
            type: 'number',
            valueFormatter: (params) => params.value
        },
        {
            field: 'selling_price',
            headerName: 'Selling Price',
            flex: 0.7,
            type: 'number',
            valueFormatter: (params) => params.value
        },
        {
            field: 'stock',
            headerName: 'Stock',
            flex: 0.5,
            type: 'number',
            renderCell: (params) => (
                <span style={{
                    color: params.value === 0 ? 'red' : params.value < 10 ? 'orange' : 'green',
                    fontWeight: 'bold'
                }}>
                    {params.value}
                </span>
            )
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 0.3,

            sortable: false,
            renderCell: (params) => (
                <div className=''>
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
                    >
                    </Button>
                    <Menu
                        elevation={1}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleClose}>
                            Edit
                        </MenuItem>
                        <MenuItem onClick={handleAddStockClick}>Adding Stock</MenuItem>
                        <MenuItem onClick={handleClose}>More Detail</MenuItem>
                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                    </Menu>
                </div>
            )
        },
    ];

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

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
                    className='p-2'

                    rows={products}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    pagination
                    disableSelectionOnClick
                    getRowId={(row) => row.product_id}
                />
            </Box>

            <Dialog open={stockDialogOpen} onClose={handleStockDialogClose} fullScreen={fullScreen}>
                <DialogTitle>Add Stock</DialogTitle>
                <DialogContent>
                    <DialogContentText className='py-3 pt-0'>
                        {selectedProduct && `Product: ${selectedProduct.product_name}`}
                    </DialogContentText>
                    <TextField
                        label=""
                        id="stock"
                        name="stock"
                        type="number"
                        // value={values.product_name}
                        onChange={(e) => setNumberStock(e.target.value)}
                        // error={errors.product_name}
                        prefixIcon='FaBoxOpen'

                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleStockDialogClose}>Cancel</Button>
                    <Button onClick={handleStockSubmit}>Add Stock</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProductTable;