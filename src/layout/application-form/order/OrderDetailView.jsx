import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    Divider,
    Paper,
    CircularProgress,
    Button,
    Stack
} from '@mui/material';
import { POS_GET } from '../../../website/service/ApiService';

const OrderDetailPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const order = searchParams.get("order") || "demo-order";

    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const res = await POS_GET(`v1/order/details/${order}`);
                console.log(res);

                if (res) {
                    setOrderData(res.data);
                    setLoading(false);
                } else {
                    setError(res.message || 'Failed to fetch order details');
                }
            } catch (err) {
                console.error('Error fetching order details:', err);
                setError('Failed to load order details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [order]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount, currency = 'USD') => {
        if (currency === 'USD') {
            return `$${parseFloat(amount).toFixed(2)}`;
        } else if (currency === 'RIEL') {
            return `${parseFloat(amount).toLocaleString()} ៛`;
        }
        return amount;
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'shipped': return 'secondary';
            case 'delivered': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'error';
            default: return 'default';
        }
    };

    // Loading state
    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                bgcolor="grey.50"
            >
                <Box textAlign="center">
                    <CircularProgress size={40} sx={{ mb: 2 }} />
                    <Typography color="text.secondary">Loading order details...</Typography>
                </Box>
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                bgcolor="grey.50"
            >
                <Paper elevation={1} sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
                    <Typography variant="h6" color="error" gutterBottom>
                        Order Not Found
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                        {error}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </Button>
                </Paper>
            </Box>
        );
    }

    // No data state
    if (!orderData) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                bgcolor="grey.50"
            >
                <Typography color="text.secondary">No order data available</Typography>
            </Box>
        );
    }

    const { order_info, order_details } = orderData;

    return (
        <Box minHeight="100vh" bgcolor="" sx={{ overflow: 'auto', }} py={3}>
            <Container maxWidth="lg" className='bg-white p-4 rounded-lg'>
                {/* Header */}
                <Box mb={4}>
                    <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                        Order Details
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Order placed on {formatDate(order_info.order_date)}
                    </Typography>
                </Box>

                {/* Order Information */}
                <Card sx={{ mb: 4, backgroundColor: "rgb(247, 247, 247)", borderRadius: '10px' }} elevation={0} className='bg-gray-50'>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Order Information
                        </Typography>
                        <Grid container spacing={3}>
                            {/* Order Status */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Delivery Status
                                    </Typography>
                                    <Chip
                                        label={order_info.delivery_status}
                                        color={getStatusColor(order_info.delivery_status)}
                                        variant="filled"
                                    />
                                </Box>
                            </Grid>

                            {/* Payment Method */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Payment Method
                                    </Typography>
                                    <Typography variant="body1">
                                        {order_info.payment_type}
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Payment Status */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Payment Status
                                    </Typography>
                                    <Chip
                                        label={order_info.payment_status}
                                        color={getPaymentStatusColor(order_info.payment_status)}
                                        variant="filled"
                                    />
                                </Box>
                            </Grid>

                            {/* Exchange Rate */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Exchange Rate
                                    </Typography>
                                    <Typography variant="body1">
                                        1 USD = {parseFloat(order_info.exchange_rate).toLocaleString()} ៛
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Description */}
                            <Grid item xs={12}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Description
                                    </Typography>
                                    <Typography variant="body1">
                                        {order_info.description}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Order Items */}
                <Card sx={{ mb: 4 }} elevation={0}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Order Items
                        </Typography>
                        <List>
                            {order_details.map((item, index) => (
                                <React.Fragment key={index}>
                                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                        <ListItemAvatar className='pe-4'>
                                            <Avatar
                                                src={`https://99designs-blog.imgix.net/blog/wp-content/uploads/2017/03/9fe6c9ec-162f-4156-bb7e-4ee28dc65092-e1488324765390.jpg?auto=format&q=60&w=1760&h=1325&fit=crop&crop=faces`}
                                                alt={`Product ${item.product_code}`}
                                                sx={{ width: 60, height: 60 }}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="text-xxl" component="div">
                                                    Product Code: {item.product_code}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box>

                                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                                        <Chip
                                                            label={`Qty: ${item.qty}`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                        <Chip
                                                            label={`Unit: ${formatCurrency(item.price)}`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                        {item.discount_amount !== "0" && (
                                                            <Chip
                                                                label={`Discount: ${formatCurrency(item.discount_amount)}`}
                                                                size="small"
                                                                color="error"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                    </Stack>
                                                </Box>
                                            }
                                        />
                                        <Box textAlign="right">
                                            <Typography variant="h6" fontWeight="bold">
                                                {formatCurrency(item.total_usd)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {formatCurrency(item.total_riel, 'RIEL')}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                    {index < order_details.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>

                {/* Order Summary */}
                <Card sx={{ mb: 4, backgroundColor: "rgb(255, 252, 253)", borderRadius: '10px' }} elevation={0}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Order Summary
                        </Typography>
                        <Box>
                            <Box display="flex" justifyContent="space-between" py={1}>
                                <Typography>Subtotal:</Typography>
                                <Typography>{formatCurrency(order_info.sub_total)}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" py={1}>
                                <Typography>Delivery:</Typography>
                                <Typography>{formatCurrency(order_info.delivery_cost)}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" py={1}>
                                <Typography>Discount:</Typography>
                                <Typography color="error">-{formatCurrency(order_info.discount_amount)}</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box display="flex" justifyContent="space-between" py={1}>
                                <Typography variant="h6" fontWeight="bold">
                                    Total (USD):
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    {formatCurrency(order_info.total_amount_usd)}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" py={1}>
                                <Typography variant="body2" color="text.secondary">
                                    Total (Riel):
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {formatCurrency(order_info.total_amount_riel, 'RIEL')}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default OrderDetailPage;