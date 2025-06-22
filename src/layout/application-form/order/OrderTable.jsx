import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
    Box,
    Chip,
    CircularProgress,
    Typography,
    Paper,
    Avatar,
    Tooltip,
    Stack,
    useTheme,
    alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { POS_GET } from '../../../website/service/ApiService';
import {
    ShoppingBag,
    Calendar,
    DollarSign,
    CreditCard,
    Package,
    TrendingUp
} from 'lucide-react';

const OrderTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await POS_GET('v1/order');
                if (res.success) {
                    setOrders(res.data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusChip = (status) => {
        // Handle null/undefined status
        const safeStatus = status || 'unknown';

        const statusConfig = {
            pending: {
                color: 'warning',
                icon: '⏳',
                bgColor: alpha(theme.palette.warning.main, 0.1),
                textColor: theme.palette.warning.main
            },
            confirmed: {
                color: 'info',
                icon: '✓',
                bgColor: alpha(theme.palette.info.main, 0.1),
                textColor: theme.palette.info.main
            },
            completed: {
                color: 'success',
                icon: '✅',
                bgColor: alpha(theme.palette.success.main, 0.1),
                textColor: theme.palette.success.main
            },
            cancelled: {
                color: 'error',
                icon: '❌',
                bgColor: alpha(theme.palette.error.main, 0.1),
                textColor: theme.palette.error.main
            },
            unknown: {
                color: 'default',
                icon: '❓',
                bgColor: alpha(theme.palette.grey[500], 0.1),
                textColor: theme.palette.grey[600]
            }
        };

        const config = statusConfig[safeStatus] || statusConfig.unknown;

        return (
            <Chip
                label={
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <span>{config.icon}</span>
                        <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>
                            {safeStatus}
                        </span>
                    </Stack>
                }
                sx={{
                    backgroundColor: config.bgColor,
                    color: config.textColor,
                    border: `1px solid ${alpha(config.textColor, 0.3)}`,
                    fontWeight: 600,
                    borderRadius: '8px',
                    '&:hover': {
                        backgroundColor: alpha(config.textColor, 0.15),
                        transform: 'translateY(-1px)',
                        boxShadow: `0 4px 8px ${alpha(config.textColor, 0.2)}`
                    },
                    transition: 'all 0.2s ease-in-out'
                }}
                size="small"
            />
        );
    };

    const getPaymentChip = (status) => {
        // Handle null/undefined status
        const safeStatus = status || 'unknown';

        const paymentConfig = {
            pending: {
                color: 'warning',
                icon: '💳',
                bgColor: alpha(theme.palette.warning.main, 0.1),
                textColor: theme.palette.warning.main
            },
            paid: {
                color: 'success',
                icon: '💰',
                bgColor: alpha(theme.palette.success.main, 0.1),
                textColor: theme.palette.success.main
            },
            failed: {
                color: 'error',
                icon: '❌',
                bgColor: alpha(theme.palette.error.main, 0.1),
                textColor: theme.palette.error.main
            },
            unknown: {
                color: 'default',
                icon: '❓',
                bgColor: alpha(theme.palette.grey[500], 0.1),
                textColor: theme.palette.grey[600]
            }
        };

        const config = paymentConfig[safeStatus] || paymentConfig.unknown;

        return (
            <Chip
                label={
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <span>{config.icon}</span>
                        <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>
                            {safeStatus}
                        </span>
                    </Stack>
                }
                sx={{
                    backgroundColor: config.bgColor,
                    color: config.textColor,
                    border: `1px solid ${alpha(config.textColor, 0.3)}`,
                    fontWeight: 600,
                    borderRadius: '8px',
                    '&:hover': {
                        backgroundColor: alpha(config.textColor, 0.15),
                        transform: 'translateY(-1px)',
                        boxShadow: `0 4px 8px ${alpha(config.textColor, 0.2)}`
                    },
                    transition: 'all 0.2s ease-in-out'
                }}
                size="small"
            />
        );
    };

    const formatCurrency = (amount, currency = 'USD') => {
        if (!amount) return '-';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency === 'USD' ? 'USD' : 'KHR',
            minimumFractionDigits: currency === 'USD' ? 2 : 0,
            maximumFractionDigits: currency === 'USD' ? 2 : 0
        }).format(amount);
    };

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
            field: 'order_id',
            headerName: 'Order ID',
            flex: 1,
            minWidth: 120,
            renderCell: (params) => (
                <div className='flex items-center gap-2 h-100'>
                    <Avatar sx={{
                        width: 28,
                        height: 28,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontSize: '0.75rem'
                    }}>
                        <ShoppingBag size={14} />
                    </Avatar>
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.875rem'
                        }}
                    >
                        #{params.value.split('-')[0]}
                    </Typography>
                </div>
            )
        },
        {
            field: 'order_date',
            headerName: 'Date & Time',
            flex: 1,
            minWidth: 140,
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
            field: 'total_amount_usd',
            headerName: 'Total (USD)',
            flex: 0.8,
            minWidth: 100,
            type: 'number',
            renderCell: (params) => (
                <Box height='100%' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DollarSign size={16} color={theme.palette.success.main} />
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        color="success.main"
                    >
                        {formatCurrency(params.value, 'USD')}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'total_amount_riel',
            headerName: 'Total (Riel)',
            flex: 0.8,
            minWidth: 110,
            type: 'number',
            renderCell: (params) => (
                <Box height='100%' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp size={16} color={theme.palette.info.main} />
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        color="info.main"
                    >
                        {formatCurrency(params.value, 'KHR')}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'order_status_state',
            headerName: 'Order Status',
            flex: 0.9,
            minWidth: 130,
            renderCell: (params) => getStatusChip(params.value)
        },
        {
            field: 'payment_status',
            headerName: 'Payment',
            flex: 0.8,
            minWidth: 120,
            renderCell: (params) => getPaymentChip(params.value)
        },
        {
            field: 'delivery_status',
            headerName: 'Delivery',
            flex: 0.8,
            minWidth: 120,
            renderCell: (params) => (
                <Box>
                    {params.row?.delivery_completed ? (
                        <Chip
                            label={
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Package size={14} />
                                    <span>Delivered</span>
                                </Stack>
                            }
                            sx={{
                                backgroundColor: alpha(theme.palette.success.main, 0.1),
                                color: theme.palette.success.main,
                                border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                                fontWeight: 600,
                                borderRadius: '8px',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.success.main, 0.15),
                                    transform: 'translateY(-1px)',
                                    boxShadow: `0 4px 8px ${alpha(theme.palette.success.main, 0.2)}`
                                },
                                transition: 'all 0.2s ease-in-out'
                            }}
                            size="small"
                        />
                    ) : (
                        <Chip
                            label={
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Package size={14} />
                                    <span>{params.value || 'Pending'}</span>
                                </Stack>
                            }
                            sx={{
                                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                color: theme.palette.warning.main,
                                border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                                fontWeight: 600,
                                borderRadius: '8px',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.warning.main, 0.15),
                                    transform: 'translateY(-1px)',
                                    boxShadow: `0 4px 8px ${alpha(theme.palette.warning.main, 0.2)}`
                                },
                                transition: 'all 0.2s ease-in-out'
                            }}
                            size="small"
                        />
                    )}
                </Box>
            )
        },
    ];

    if (loading) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
                gap={2}
            >
                <CircularProgress
                    size={48}
                    thickness={4}
                    sx={{
                        color: theme.palette.primary.main,
                    }}
                />
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    Loading orders...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ minWidth: 992, minHeight: 400 }}>
            <DataGrid
                rows={orders}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5, 10, 20, 50]}
                pagination
                disableSelectionOnClick
                getRowId={(row) => row.order_id}
                sx={{
                    border: 'none',
                    '& .MuiDataGrid-main': {
                        borderRadius: '16px',
                    },
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
                        borderBottom: `0.5px solid ${alpha(theme.palette.divider, 0.08)}`,
                        '&:focus': {
                            outline: 'none'
                        }
                    },
                    '& .MuiDataGrid-row': {
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                            // transform: 'scale(1.01)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`
                        },
                        '&:nth-of-type(even)': {
                            backgroundColor: alpha(theme.palette.action.hover, 0.02)
                        }
                    },
                    '& .MuiDataGrid-footerContainer': {
                        // borderTop: `0.5px solid ${alpha(theme.palette.divider, 0.08)}`,
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(8px)'
                    },
                    '& .MuiDataGrid-selectedRowCount': {
                        visibility: 'hidden'
                    },
                    '& .MuiTablePagination-toolbar': {
                        paddingRight: '20px'
                    },
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                        fontWeight: 500,
                        color: theme.palette.text.secondary
                    }
                }}
                disableRowSelectionOnClick
                rowHeight={64}
                headerHeight={56}
            />
        </Box>
    );
};

export default OrderTable;