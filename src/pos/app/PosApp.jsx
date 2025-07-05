import React, { useState, useMemo, useEffect } from 'react';
import Cookies from 'js-cookie';
import {
    AppBar,
    Toolbar,
    Typography,
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
    Paper,
    Grid2,
    Avatar
} from '@mui/material';
import Grid from '@mui/material/Grid';
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
import { StyleColors, Translate } from '../../website/extension/Extension';
import LanguageSwitcher from '../../website/languages/LanguageSwitcher';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '../../layout/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

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
        { id: 'cash', name: 'Cash', icon: '💵', src: "https://www.usatoday.com/gcdn/-mm-/e76b3f8780406e2332171b90051c86d67cb0349b/c=0-85-2122-1282/local/-/media/USATODAY/USATODAY/2014/09/04/1409858217000-492529263.jpg?width=2122&height=1197&fit=crop&format=pjpg&auto=webp" },

        { id: 'ac', name: 'ACLEDA Bank Plc. - Cambodia', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM37KLHTgu31C4LMRGMBzIu7QwwJXVeOC-EA&s' },
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
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);
    const navigate = useNavigate();

    const { user } = useAuth();

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
                    payment_type: selectedPaymentMethod?.join(', '),
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

            if (response) {
                sendOrderNotification(response);
                clearCart();
                setSelectedPaymentMethod([]);
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
    const sendOrderNotification = async (orderResponse) => {
        const order = orderResponse.data.order_info;
        const items = orderResponse.data.order_details;

        // Format currency values
        const formatCurrency = (amount) => parseFloat(amount).toFixed(2);
        const formatRiel = (amount) => new Intl.NumberFormat('en-US').format(parseFloat(amount));

        // Build items list
        const itemsList = items.map(item => `
            🛒 <b>${item.product_code}</b>
            ├─ Quantity: ${item.qty}
            ├─ Price: $${formatCurrency(item.price)}
            ${item.discount ? `├─ Discount: ${item.discount}${item.discount_unit === 'percentage' ? '%' : ''}` : ''}
            └─ Subtotal: $${formatCurrency(item.sub_total)}
            `).join('\n');

        // Calculate s
        const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

        // Create management link
        const manageLink = `https://admin.txteams.net/manage-order?order=${order.order_id}`;

        // Compose the message
        const message = `
            <b>🛍️ NEW ORDER #${order.order_id.slice(0, 8).toUpperCase()}</b>
            ━━━━━━━━━━━━━━━━━━━━━
            <b>📅 Order Date:</b> ${new Date(order.order_date).toLocaleString()}
            <b>🔄 Status:</b> ${order.order_status_text} (${order.order_status_state})
            <b>💳 Payment:</b> ${order.payment_type.replace('_', ' ').toUpperCase()} • ${order.payment_status.toUpperCase()}

            <b>📦 ORDER ITEMS (${totalItems})</b>
            ${itemsList}

            <b>💰 ORDER SUMMARY</b>
            ├─ Subtotal: $${formatCurrency(order.sub_total)}
            ├─ Discount: $${formatCurrency(order.discount_amount)}
            ├─ Delivery: $${formatCurrency(order.delivery_cost)}
            ├─ Exchange Rate: ៛${formatCurrency(order.exchange_rate)}/$
            └─ <b>TOTAL: $${formatCurrency(order.total_amount_usd)} (៛${formatRiel(order.total_amount_riel)})</b>

            <b>🚚 Delivery Status:</b> ${order.delivery_status.toUpperCase()} ${order.delivery_completed ? '✅' : '🕒'}
            <b>📝 Notes:</b> ${order.description || 'No additional notes'}

            <a href="${manageLink}">🔗 Manage This Order</a>

            <i>Order created at: ${new Date(order.created_date).toLocaleString()}</i>
            `;

        const res = await POS_POST('telegram/send-message', {
            chatId: "1415543660",
            message: message,
            parseMode: "HTML"
        });
        const res2 = await POS_POST('telegram/send-message', {
            chatId: "5006388556",
            message: message,
            parseMode: "HTML"
        });

        return res;
    };


    return (
        <div className="min-h-screen w-full fixed-top">
            {/* Header */}
            <AppBar position="static" sx={{ backgroundColor: StyleColors.componentsColor }}>
                <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} className='flex items-center justify-between'>
                    <IconButton variant='text' onClick={() => navigate(-1)} sx={{ color: "white" }} className='flex'>
                        <PowerSettingsNewIcon />
                    </IconButton>

                    {/* Mobile: Show cart badge and payment button */}
                    <div className='flex'>
                        <Badge badgeContent={totalItems} color="error" className='md:hidden'>
                            <IconButton color="inherit" onClick={() => setPaymentDialog(true)}>
                                <Payment sx={{ fontSize: { xs: 20, md: 24 } }} />
                            </IconButton>
                        </Badge>

                        {/* Desktop: Show full header items */}
                        <Box className="hidden md:flex md:items-center">
                            <Box className="px-2">
                                <LanguageSwitcher isShowBorder={true} />
                            </Box>
                            <Avatar
                                src={user.image_url}
                                sx={{ width: { xs: 20, md: 25 }, height: { xs: 20, md: 25 }, border: '1px solid white', ml: 1 }}
                            />
                            <Typography variant="body2" className="px-2 hidden lg:block">
                                {user.first_name} {user.last_name}
                            </Typography>
                        </Box>
                    </div>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: { xs: 1, md: 2 }, px: { xs: 1, md: 3 } }}>
                <Grid2 container spacing={{ xs: 1, md: 3 }}>
                    {/* Left Panel - Products */}
                    <Grid2
                        size={{ xs: 12, md: 8, lg: 8 }}
                        sx={{
                            backgroundColor: "white",
                            borderRadius: "10px",
                            p: { xs: 1, md: 2 }
                        }}
                    >
                        {/* Category Filters - Horizontal scroll on mobile */}
                        <Box sx={{ p: { xs: 1, md: 2 } }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    mb: 2,
                                    overflowX: "auto",
                                    pb: 1,
                                    "&::-webkit-scrollbar": {
                                        height: "4px"
                                    },
                                    "&::-webkit-scrollbar-thumb": {
                                        backgroundColor: "rgba(0,0,0,0.2)",
                                        borderRadius: "2px"
                                    }
                                }}
                            >
                                {ProductService.getCategories().map((category) => (
                                    <Box
                                        key={category.id}
                                        className='py-2 px-3 rounded-[8px] whitespace-nowrap'
                                        onClick={() => setSelectedCategory(category.id)}
                                        sx={{
                                            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                                            cursor: "pointer",
                                            backgroundColor: selectedCategory === category.id ? StyleColors.backgroundText : "white",
                                            borderColor: category.color,

                                            minWidth: "fit-content",
                                            flexShrink: 0
                                        }}
                                    >
                                        {category.name}
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* Products Grid */}
                        <Grid2
                            container
                            spacing={{ xs: 1, sm: 1.5, md: 2 }}
                            sx={{
                                maxHeight: { xs: "calc(100vh - 200px)", md: "calc(100vh - 220px)" },
                                overflowY: "auto",
                                scrollbarWidth: "none",
                                "&::-webkit-scrollbar": {
                                    display: "none"
                                },
                                msOverflowStyle: "none",
                                px: { xs: 1, md: 2 }
                            }}
                        >
                            {filteredProducts.length === 0 ? (
                                <Grid2 xs={12}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            textAlign: "center",
                                            color: "text.secondary",
                                            py: 4,
                                            fontSize: { xs: "1rem", md: "1.25rem" }
                                        }}
                                    >
                                        {searchQuery ? `No products found for "${searchQuery}"` : `${Translate({km: "មិនមានផលិតផលទេ", en: "No products available"})}`}
                                    </Typography>
                                </Grid2>
                            ) : (
                                filteredProducts.map((product) => (
                                    <Grid2 key={product.code} size={{ xs: 6, sm: 4, md: 4, lg: 3 }}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                height: "100%",
                                                cursor: "pointer",
                                                transition: "transform 0.2s, box-shadow 0.2s",
                                                border: "1px solid",
                                                borderColor: "grey.200",
                                                "&:hover": {
                                                    transform: "translateY(-2px)",
                                                    boxShadow: 3
                                                },
                                                "&:active": {
                                                    transform: "translateY(0px)"
                                                }
                                            }}
                                            onClick={() => addToSellList(product)}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={product.image_url || 'https://via.placeholder.com/150'}
                                                alt={product.product_name}
                                                sx={{
                                                    height: { xs: 80, sm: 120, md: 160, lg: 180 },
                                                    objectFit: "cover"
                                                }}
                                                onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                                            />
                                            <CardContent sx={{ p: { xs: 1, sm: 1.5, md: 2 } }}>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight="medium"
                                                    sx={{
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                        mb: 1,
                                                        fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.875rem" },
                                                        lineHeight: { xs: 1.2, md: 1.4 }
                                                    }}
                                                >
                                                    {product.product_name}
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    color="success.main"
                                                    sx={{
                                                        fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    ${parseFloat(product.selling_price || 0).toFixed(2)}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    display="block"
                                                    sx={{ fontSize: { xs: "0.65rem", md: "0.75rem" } }}
                                                >
                                                    Stock: {product.stock || 0}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid2>
                                ))
                            )}
                        </Grid2>
                    </Grid2>

                    {/* Right Panel - Sell List (Desktop Only) */}
                    <Grid2 size={{ md: 4, lg: 4 }} className="hidden md:block" >
                        <Paper
                            sx={{
                                p: 2,
                                position: "sticky",
                                top: 16,
                                borderRadius: "10px",
                                backgroundColor: "white",
                                minHeight: '800px',
                                maxHeight: "calc(100vh - 120px)",
                                display: "flex",
                                flexDirection: "column"
                            }}
                            elevation={0}
                        >
                            <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                                <ShoppingCart sx={{ mr: 1 }} />
                                Sell List ({totalItems} items)
                            </Typography>

                            {sellList.length === 0 ? (
                                <div className='h-100 flex flex-col justify-center items-center center'>


                                </div>
                            ) : (
                                <List sx={{ flexGrow: 1, overflowY: "auto", maxHeight: "500px" }}>
                                    {sellList.map((item) => (
                                        <div key={item.code}>
                                            <ListItem sx={{ px: 0 }}>
                                                <ListItemText
                                                    primary={item.product_name}
                                                    secondary={`$${parseFloat(item.selling_price || 0).toFixed(2)} each`}
                                                    sx={{ flexGrow: 1 }}
                                                />
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <IconButton size="small" onClick={() => updateQuantity(item.code, item.quantity - 1)}>
                                                        <Remove fontSize="small" />
                                                    </IconButton>
                                                    <Typography component="span" sx={{ mx: 1, minWidth: 32, textAlign: "center" }}>
                                                        {item.quantity}
                                                    </Typography>
                                                    <IconButton size="small" onClick={() => updateQuantity(item.code, item.quantity + 1)}>
                                                        <Add fontSize="small" />
                                                    </IconButton>
                                                    {/* <IconButton size="small" onClick={() => removeFromSellList(item.code)} sx={{ color: "error.main" }}>
                                    <Delete fontSize="small" />
                                </IconButton> */}
                                                </Box>
                                            </ListItem>
                                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "right", mr: 2, mb: 1 }}>
                                                Subtotal: ${(parseFloat(item.selling_price || 0) * item.quantity).toFixed(2)}
                                            </Typography>
                                            <Divider />
                                        </div>
                                    ))}
                                </List>
                            )}

                            {/* Spacer to push payment section to bottom */}
                            {
                                sellList.length > 0 ? <Box sx={{ flexGrow: 1 }} /> : <Box sx={{ flexGrow: 1 }} className="center">
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                                        {Translate({ km: 'មិនមានទំនិញក្នុងបញ្ជី', en: 'No items in sell list' })}
                                    </Typography>
                                </Box>
                            }

                            {/* Payment Section - Always at bottom */}
                            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
                                <Typography variant="h6" sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <span>{Translate({ km: 'ចំនួនទំនិញសរុប ៖', en: 'Total Items:' })}</span>
                                    <span>{totalItems}</span>
                                </Typography>
                                <Typography variant="h5" fontWeight="bold" color="success.main" sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>{Translate({ km: 'ចំនួនទឹកប្រាក់សរុប :', en: 'Total Amount:' })}</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </Typography>
                            </Box>

                            <Button
                                fullWidth

                                className='py-3'
                                variant="contained"
                                size="large"
                                disabled={(sellList.length === 0)}
                                onClick={() => setPaymentDialog(true)}
                                sx={{
                                    mt: 2,
                                    background: StyleColors.componentsColor,
                                    color: "white"
                                }}
                                startIcon={<Payment />}
                            >
                                Payment
                            </Button>



                        </Paper>
                    </Grid2>
                </Grid2>
            </Container>

            {/* Mobile Bottom Cart Summary */}
            <Box
                className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50"
                sx={{ p: 2 }}
            >
                {sellList.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                            {totalItems} items • ${totalAmount.toFixed(2)}
                        </Typography>
                    </Box>
                )}
                <Box sx={{ display: "flex", gap: 1 }}>
                    {sellList.length > 0 && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={clearCart}
                            sx={{ minWidth: "auto", px: 2 }}
                        >
                            <Delete fontSize="small" />
                        </Button>
                    )}
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => setPaymentDialog(true)}
                        disabled={sellList.length === 0}
                        sx={{
                            background: StyleColors.componentsColor,
                            color: "white"
                        }}
                        startIcon={<Payment />}
                    >
                        {sellList.length === 0 ? 'Cart Empty' : `Pay $${totalAmount.toFixed(2)}`}
                    </Button>
                </Box>
            </Box>

            {/* Add bottom padding for mobile to account for fixed bottom bar */}
            <Box className="md:hidden" sx={{ height: "80px" }} />

            {/* Payment Dialog - Enhanced for mobile */}
            <Dialog
                open={paymentDialog}
                onClose={() => setPaymentDialog(false)}
                fullWidth
                maxWidth="sm"
                fullScreen={window.innerWidth < 600} // Full screen on mobile
            >
                <DialogTitle
                    className="text-center"
                    sx={{
                        fontSize: { xs: "1.25rem", md: "1.5rem" },
                        pb: { xs: 1, md: 2 }
                    }}
                >
                    <Payment className="mr-2" />
                    Process Payment
                </DialogTitle>
                <DialogContent sx={{ px: { xs: 2, md: 3 } }}>
                    <Box className="mb-4 p-3 bg-gray-50 rounded">
                        <Typography variant="h6" className="mb-2" sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
                            Order Summary:
                        </Typography>
                        <Typography sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
                            tems: {totalItems}
                        </Typography>
                        <Typography
                            variant="h5"
                            className="font-bold text-green-600"
                            sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
                        >
                            Total Amount: ${totalAmount.toFixed(2)}
                        </Typography>
                    </Box>

                    {selectedPaymentMethod?.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, mb: 2 }}>
                            {selectedPaymentMethod.map((methodName) => (
                                <Chip
                                    avatar={<Avatar src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM37KLHTgu31C4LMRGMBzIu7QwwJXVeOC-EA&s' />}
                                    key={methodName}
                                    label={methodName}
                                    variant='outlined'
                                    size={window.innerWidth < 600 ? "small" : "medium"}
                                    sx={{
                                        color: 'dark',
                                        '& .MuiChip-icon': {
                                            color: 'success.main',
                                            marginLeft: '8px',
                                            fontSize: '18px'
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    )}

                    <Typography variant="subtitle2" sx={{ mb: 1, fontSize: { xs: "0.875rem", md: "1rem" } }}>
                        Select Payment Methods:
                    </Typography>
                    <List
                        className="max-h-[200px] overflow-y-auto bg-gray-50 rounded mb-3"
                        sx={{
                            maxHeight: { xs: "150px", md: "200px" }
                        }}
                    >
                        {PaymentService.getPaymentMethods().map((method) => (
                            <MenuItem
                                key={method.id}
                                value={method.name}
                                className='py-2'
                                sx={{
                                    py: { xs: 1, md: 1.5 },
                                    fontSize: { xs: "0.875rem", md: "1rem" }
                                }}
                                onClick={() =>
                                    setSelectedPaymentMethod(prev =>
                                        prev.includes(method.name)
                                            ? prev.filter(m => m !== method.name)
                                            : [...prev, method.name]
                                    )
                                }
                            >
                                <Avatar
                                    src={method.src}
                                    sx={{
                                        height: { xs: 25, md: 30 },
                                        width: { xs: 25, md: 30 },
                                        mr: 1
                                    }}
                                />
                                {method.name}
                            </MenuItem>
                        ))}
                    </List>

                    {sellList.length > 0 && (
                        <>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontSize: { xs: "0.875rem", md: "1rem" } }}>
                                Order Items:
                            </Typography>
                            <List
                                className="max-h-40 overflow-y-auto bg-gray-50 rounded"
                                sx={{
                                    maxHeight: { xs: "120px", md: "160px" }
                                }}
                            >
                                {sellList.map((item) => (
                                    <ListItem key={item.code} dense sx={{ py: { xs: 0.5, md: 1 } }}>
                                        <ListItemText
                                            primary={`${item.product_name} x${item.quantity}`}
                                            secondary={`$${parseFloat(item.selling_price || 0).toFixed(2)} each`}
                                            primaryTypographyProps={{
                                                fontSize: { xs: "0.875rem", md: "1rem" }
                                            }}
                                            secondaryTypographyProps={{
                                                fontSize: { xs: "0.75rem", md: "0.875rem" }
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            className="font-semibold"
                                            sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                                        >
                                            ${(parseFloat(item.selling_price || 0) * item.quantity).toFixed(2)}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                </DialogContent>
                <DialogActions
                    className="p-4"
                    sx={{
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 1, sm: 0 },
                        p: { xs: 2, md: 3 }
                    }}
                >

                    <Button onClick={() => setPaymentDialog(false)} color="inherit" fullWidth className="text-error py-3 block sm:hidden">
                        Cancel
                    </Button>
                    <Button
                        onClick={processPayment}
                        variant="contained"

                        disabled={(selectedPaymentMethod.length == 0) || (sellList.length === 0)}
                        className="text-white py-3"
                        fullWidth

                        sx={{
                            background: StyleColors.componentsColor,
                            order: { xs: 1, sm: 2 },
                            ml: { sm: 1 }
                        }}
                    >
                        {processingPayment ? 'Processing...' : 'Complete Payment'}
                    </Button>

                </DialogActions>
            </Dialog>
        </div>
    );
}