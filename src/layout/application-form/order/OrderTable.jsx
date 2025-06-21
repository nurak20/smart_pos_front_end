import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { POS_GET } from '../../../website/service/ApiService';

const OrderTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();

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
        let color;
        switch (status) {
            case 'pending':
                color = 'warning';
                break;
            case 'confirmed':
                color = 'info';
                break;
            case 'completed':
                color = 'success';
                break;
            case 'cancelled':
                color = 'error';
                break;
            default:
                color = 'default';
        }
        return <Chip label={status} color={color} size="small" />;
    };

    const getPaymentChip = (status) => {
        let color;
        switch (status) {
            case 'pending':
                color = 'warning';
                break;
            case 'paid':
                color = 'success';
                break;
            case 'failed':
                color = 'error';
                break;
            default:
                color = 'default';
        }
        return <Chip label={status} color={color} size="small" />;
    };

    const columns = [
        {
            field: 'order_id',
            headerName: 'Order ID',
            flex: 1,
            renderCell: (params) => (
                <p
                    className='pointer hover-line'
                    onClick={() => navigate(`/orders/${params.value}`)}
                >
                    #{params.value.split('-')[0]}
                </p>
            )
        },
        {
            field: 'order_date',
            headerName: 'Date',
            flex: 0.8,
            valueFormatter: (params) => params.value
        },
        {
            field: 'total_amount_usd',
            headerName: 'Total (USD)',
            flex: 0.7,
            type: 'number',
            valueFormatter: (params) => params.value
        },
        {
            field: 'total_amount_riel',
            headerName: 'Total (Riel)',
            flex: 0.8,
            type: 'number',
            valueFormatter: (params) => params.value
        },
        {
            field: 'order_status_state',
            headerName: 'Order Status',
            flex: 0.8,
            renderCell: (params) => getStatusChip(params.value)
        },
        {
            field: 'payment_status',
            headerName: 'Payment',
            flex: 0.7,
            renderCell: (params) => getPaymentChip(params.value)
        },
        // {
        //     field: 'payment_type',
        //     headerName: 'Payment Type',
        //     flex: 0.7,
        //     valueFormatter: (params) => params.value
        // },
        {
            field: 'delivery_status',
            headerName: 'Delivery',
            flex: 0.7,
            renderCell: (params) => (
                <Box>
                    {params.row.delivery_completed ? (
                        <Chip label="Delivered" color="success" size="small" />
                    ) : (
                        <Chip label={params.value} color="warning" size="small" />
                    )}
                </Box>
            )
        },
    ];

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <DataGrid
            rows={orders}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 20, 50]}
            pagination
            disableSelectionOnClick
            getRowId={(row) => row.order_id}

        />
    );
};

export default OrderTable;