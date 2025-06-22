import React, { useState, useMemo, useEffect } from 'react';
import Cookies from 'js-cookie';
import {
    AppBar,
    Toolbar,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Badge,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Container,
    Paper
} from '@mui/material';
import {
    Add,
    Remove,
    Delete,
    Search,
    ShoppingCart,
    Payment,
    Category,
    Inventory
} from '@mui/icons-material';
import { POS_GET, POS_POST } from '../../website/service/ApiService';

// Product Service Provider - Clean, professional code structure
class ProductService {
    static categories = [
        { id: 'all', name: 'All Products', color: '#2196f3' },
        { id: 'beverages', name: 'Beverages', color: '#4caf50' },
        { id: 'snacks', name: 'Snacks', color: '#ff9800' },
        { id: 'electronics', name: 'Electronics', color: '#9c27b0' },
        { id: 'clothing', name: 'Clothing', color: '#f44336' },
        { id: 'books', name: 'Books', color: '#795548' }
    ];

    static getCategories() {
        return this.categories;
    }

    static async getProducts() {
        const response = await POS_GET(`v1/products`);
        return response.data;  // response.data becomes the resolved value
    }

    static getProductsByCategory(categoryId, products) {
        if (categoryId === 'all') return products || [];
        return products.filter(product => product.category_id === categoryId);
    }

    static searchProducts(query, products) {
        if (!query || !products) return products || [];
        const searchTerm = query.toLowerCase();
        return products.filter(product =>
            product.product_name.toLowerCase().includes(searchTerm) ||
            product.brand_name?.toLowerCase().includes(searchTerm) ||
            product.code.toLowerCase().includes(searchTerm) ||
            product.description?.toLowerCase().includes(searchTerm)
        );
    }

    static getCategoryById(id) {
        return this.categories.find(cat => cat.id === id);
    }
}

// Payment Service Provider
class PaymentService {
    static paymentMethods = [
        { id: 'cash', name: 'Cash', icon: '💵' },
        { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
        { id: 'mobile', name: 'Mobile Payment', icon: '📱' },
        { id: 'bank', name: 'Bank Transfer', icon: '🏦' }
    ];

    static getPaymentMethods() {
        return this.paymentMethods;
    }

    static calculateTotal(items) {
        return items.reduce((total, item) => total + (item.selling_price * item.quantity), 0);
    }

    static calculateItemCount(items) {
        return items.reduce((count, item) => count + item.quantity, 0);
    }
}

export default function POSAdminSystem() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sellList, setSellList] = useState([]);
    const [paymentDialog, setPaymentDialog] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);

    // Load cart from cookies on initial render
    useEffect(() => {
        const savedCart = Cookies.get('pos_cart');
        if (savedCart) {
            try {
                setSellList(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart data from cookies', e);
                Cookies.remove('pos_cart');
            }
        }
    }, []);

    // Save cart to cookies whenever it changes
    useEffect(() => {
        if (sellList.length > 0) {
            Cookies.set('pos_cart', JSON.stringify(sellList), { expires: 7 }); // Expires in 7 days
        } else {
            Cookies.remove('pos_cart');
        }
    }, [sellList]);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await ProductService.getProducts();
                setAllProducts(data || []);
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setAllProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Get filtered products based on category and search
    const filteredProducts = useMemo(() => {
        let list = allProducts;

        if (selectedCategory !== 'all') {
            list = list.filter(p => p.category_id === selectedCategory);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(p =>
                p.product_name.toLowerCase().includes(q) ||
                p.brand_name?.toLowerCase().includes(q) ||
                p.code.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q)
            );
        }

        return list;
    }, [allProducts, selectedCategory, searchQuery]);

    // Add product to sell list or update quantity if exists
    const addToSellList = (product) => {
        setSellList(prevList => {
            const existingItem = prevList.find(item => item.code === product.code);
            if (existingItem) {
                return prevList.map(item =>
                    item.code === product.code
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevList, { ...product, quantity: 1 }];
            }
        });
    };

    // Update quantity in sell list
    const updateQuantity = (productCode, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromSellList(productCode);
            return;
        }
        setSellList(prevList =>
            prevList.map(item =>
                item.code === productCode ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // Remove item from sell list
    const removeFromSellList = (productCode) => {
        setSellList(prevList => prevList.filter(item => item.code !== productCode));
    };

    // Clear the entire cart
    const clearCart = () => {
        setSellList([]);
    };

    // Calculate totals
    const totalAmount = PaymentService.calculateTotal(sellList);
    const totalItems = PaymentService.calculateItemCount(sellList);

    // Process payment and create order
    const processPayment = async () => {
        if (!selectedPaymentMethod) return;

        try {
            // Prepare order data
            const orderData = {
                order: {
                    order_date: new Date().toISOString(),
                    total_amount_usd: totalAmount,
                    total_amount_riel: totalAmount * 4000, // Assuming exchange rate of 4000
                    exchange_rate: 4000,
                    address_id: "550e8400-e29b-41d4-a716-446655440000", // You may want to make this dynamic
                    user_id: "550e8400-e29b-41d4-a716-446655440001", // You may want to make this dynamic
                    description: `POS Order - ${sellList.length} items`,
                    delivery_status: "pending",
                    delivery_completed: false,
                    delivery_cost: 0.00,
                    order_status_text: "Order confirmed",
                    order_status_state: "confirmed",
                    payment_status: "completed",
                    payment_type: selectedPaymentMethod.toLowerCase().replace(/[^a-z]/g, '_'),
                    discount_amount: 0.00,
                    event_discount_id: null,
                    sub_total: totalAmount
                },
                order_detail: sellList.map(item => ({
                    product_code: item.code,
                    qty: item.quantity,
                    price: parseFloat(item.selling_price || 0),
                    discount: 0,
                    discount_unit: "percentage",
                    discount_amount: 0.00,
                    sub_total: parseFloat(item.selling_price || 0) * item.quantity,
                    total_usd: parseFloat(item.selling_price || 0) * item.quantity,
                    total_riel: parseFloat(item.selling_price || 0) * item.quantity * 4000,
                    created_by: "pos_admin" // You may want to make this dynamic
                }))
            };

            // Show loading state
            setPaymentDialog(false);

            // Send order to API
            const response = await POS_POST('v1/order/invoice', orderData);

            if (response.ok) {
                const result = await response.data;
                alert(`Payment processed successfully via ${selectedPaymentMethod}!\nOrder ID: ${result.order_id || 'Generated'}\nTotal: ${totalAmount.toFixed(2)}\nItems: ${totalItems}`);
                clearCart();
                setSelectedPaymentMethod('');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to process order');
            }
        } catch (error) {
            console.error('Payment processing error:', error);
            alert(`Payment failed: ${error.message}\nPlease try again.`);
            setPaymentDialog(true); // Reopen dialog on error
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Typography variant="h6">Loading products...</Typography>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <AppBar position="static" className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Toolbar>
                    <ShoppingCart className="mr-2" />
                    <Typography variant="h6" className="flex-grow">
                        POS Admin System
                    </Typography>
                    <Badge badgeContent={totalItems} color="error">
                        <IconButton color="inherit" onClick={() => setPaymentDialog(true)}>
                            <Payment />
                        </IconButton>
                    </Badge>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" className="py-4">
                <Grid container spacing={3}>
                    {/* Left Panel - Products */}
                    <Grid item xs={12} lg={8}>
                        {/* Search Bar */}
                        <Paper className="p-4 mb-4">
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search products by name, brand, code, or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: <Search className="mr-2 text-gray-400" />
                                }}
                                className="mb-4"
                            />

                            {/* Categories */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {ProductService.getCategories().map((category) => (
                                    <Chip
                                        key={category.id}
                                        label={category.name}
                                        onClick={() => setSelectedCategory(category.id)}
                                        color={selectedCategory === category.id ? "primary" : "default"}
                                        variant={selectedCategory === category.id ? "filled" : "outlined"}
                                        className="text-sm md:text-base cursor-pointer"
                                        style={{
                                            backgroundColor: selectedCategory === category.id ? category.color : 'transparent',
                                            borderColor: category.color
                                        }}
                                    />
                                ))}
                            </div>
                        </Paper>

                        {/* Products Grid */}
                        <Grid container spacing={2}>
                            {filteredProducts.length === 0 ? (
                                <Grid item xs={12}>
                                    <Typography variant="h6" className="text-center text-gray-500 py-8">
                                        {searchQuery ? `No products found for "${searchQuery}"` : 'No products available'}
                                    </Typography>
                                </Grid>
                            ) : (
                                filteredProducts.map((product) => (
                                    <Grid item xs={6} sm={4} md={3} lg={2} key={product.code}>
                                        <Card
                                            className="h-full cursor-pointer transform transition-transform hover:scale-105 shadow-md hover:shadow-lg"
                                            onClick={() => addToSellList(product)}
                                        >
                                            <CardMedia
                                                component="img"
                                                height="120"
                                                image={product.image_url || product.image_display_group || 'https://via.placeholder.com/150x150/cccccc/ffffff?text=No+Image'}
                                                alt={product.product_name}
                                                className="h-24 md:h-32 object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/150x150/cccccc/ffffff?text=No+Image';
                                                }}
                                            />
                                            <CardContent className="p-2 md:p-3">
                                                <Typography variant="body2" className="font-semibold text-xs md:text-sm mb-1 line-clamp-2">
                                                    {product.product_name}
                                                </Typography>

                                                <Typography variant="h6" className="text-green-600 text-sm md:text-base">
                                                    ${parseFloat(product.selling_price || 0).toFixed(2)}
                                                </Typography>
                                                <Typography variant="caption" className="text-gray-500 text-xs block">
                                                    Stock: {product.stock || 0}
                                                </Typography>

                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    </Grid>

                    {/* Right Panel - Sell List */}
                    <Grid item xs={12} lg={4}>
                        <Paper className="p-4 sticky top-4">
                            <Typography variant="h6" className="mb-4 flex items-center">
                                <ShoppingCart className="mr-2" />
                                Sell List ({totalItems} items)
                            </Typography>

                            {sellList.length === 0 ? (
                                <Typography variant="body2" className="text-gray-500 text-center py-8">
                                    No items in sell list
                                </Typography>
                            ) : (
                                <>
                                    <List className="max-h-96 overflow-y-auto">
                                        {sellList.map((item) => (
                                            <div key={item.code}>
                                                <ListItem className="px-0">
                                                    <ListItemText
                                                        primary={item.product_name}
                                                        secondary={
                                                            <div>
                                                                <div>${parseFloat(item.selling_price || 0).toFixed(2)} each</div>

                                                            </div>
                                                        }
                                                        className="flex-grow"
                                                    />
                                                    <ListItemSecondaryAction className="flex items-center gap-2">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => updateQuantity(item.code, item.quantity - 1)}
                                                            className="p-1"
                                                        >
                                                            <Remove fontSize="small" />
                                                        </IconButton>
                                                        <span className="mx-2 min-w-8 text-center">{item.quantity}</span>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => updateQuantity(item.code, item.quantity + 1)}
                                                            className="p-1"
                                                        >
                                                            <Add fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => removeFromSellList(item.code)}
                                                            className="p-1 text-red-500"
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                                <Typography variant="body2" className="text-right text-gray-600 mr-4 mb-2">
                                                    Subtotal: ${(parseFloat(item.selling_price || 0) * item.quantity).toFixed(2)}
                                                </Typography>
                                                <Divider />
                                            </div>
                                        ))}
                                    </List>

                                    <Box className="mt-4 p-3 bg-gray-100 rounded">
                                        <Typography variant="h6" className="flex justify-between mb-2">
                                            <span>Total Items:</span>
                                            <span>{totalItems}</span>
                                        </Typography>
                                        <Typography variant="h5" className="flex justify-between font-bold text-green-600">
                                            <span>Total Amount:</span>
                                            <span>${totalAmount.toFixed(2)}</span>
                                        </Typography>
                                    </Box>

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        onClick={() => setPaymentDialog(true)}
                                        className="mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white"
                                        startIcon={<Payment />}
                                    >
                                        Process Payment
                                    </Button>

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="error"
                                        onClick={clearCart}
                                        className="mt-2"
                                        startIcon={<Delete />}
                                    >
                                        Clear Cart
                                    </Button>
                                </>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Payment Dialog */}
            <Dialog
                open={paymentDialog}
                onClose={() => setPaymentDialog(false)}
                maxWidth="sm"
                fullWidth
                className="md:max-w-md"
            >
                <DialogTitle className="text-center">
                    <Payment className="mr-2" />
                    Process Payment
                </DialogTitle>
                <DialogContent>
                    <Box className="mb-4 p-3 bg-gray-50 rounded">
                        <Typography variant="h6" className="mb-2">Order Summary:</Typography>
                        <Typography>Total Items: {totalItems}</Typography>
                        <Typography variant="h5" className="font-bold text-green-600">
                            Total Amount: ${totalAmount.toFixed(2)}
                        </Typography>
                    </Box>

                    <FormControl fullWidth className="mb-4">
                        <InputLabel>Payment Method</InputLabel>
                        <Select
                            value={selectedPaymentMethod}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            label="Payment Method"
                        >
                            {PaymentService.getPaymentMethods().map((method) => (
                                <MenuItem key={method.id} value={method.name}>
                                    <span className="mr-2">{method.icon}</span>
                                    {method.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {sellList.length > 0 && (
                        <List className="max-h-40 overflow-y-auto bg-gray-50 rounded">
                            {sellList.map((item) => (
                                <ListItem key={item.code} dense>
                                    <ListItemText
                                        primary={`${item.product_name} x${item.quantity}`}
                                        secondary={`$${parseFloat(item.selling_price || 0).toFixed(2)} each`}
                                    />
                                    <Typography variant="body2" className="font-semibold">
                                        ${(parseFloat(item.selling_price || 0) * item.quantity).toFixed(2)}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={() => setPaymentDialog(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={processPayment}
                        variant="contained"
                        disabled={!selectedPaymentMethod || sellList.length === 0 || processingPayment}
                        className="bg-green-600 text-white"
                    >
                        {processingPayment ? 'Processing...' : 'Complete Payment'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}