import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaRegHeart } from 'react-icons/fa';
import { GoPlus } from "react-icons/go";
import { AiOutlineMinus } from "react-icons/ai";
import Cookies from 'js-cookie';

import { FomatCurrency, StyleColors, Translate } from '../../extension/Extension';
import SectionHeader from '../../components/section_header/SectionHeader';
import Button from '../../components/Button/Button';
import './prod.css';
import website from './../../json/website.json';
import { useCartCount } from '../../provider/Provider';
import { POS_GET, POS_POST } from '../../service/ApiService';
import { ShowSuccess } from '../../components/modal/PopupDialog';
import { POSRoute } from '../../routes/Routes';

function ProductDetails() {
    const [countItem, setCountItem] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const code = params.get('code');
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    const { countCart, increment } = useCartCount();

    useEffect(() => {
        if (!code) {
            setError('No product code in URL');
            setLoading(false);
            return;
        }

        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const res = await POS_GET(`v1/products/product-detail/${code}`);

                if (res.success) {
                    setProduct(res.data);
                } else {
                    setError('Failed to load product data');
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err.message || 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [code]);

    const addToCart = async () => {
        if (!product || countItem < 1) return;

        try {
            // Call API to get item details (if needed)
            const res = await POS_POST('v1/products/add-to-card', {
                product_id: product.product_data.product_id,
                quantity: countItem,
            });

            const newItem = res.data;
            const itemId = newItem.itemId;

            // Get existing cart items from cookies
            const existing = Cookies.get('cartItems');
            let items = [];

            if (existing) {
                try {
                    items = JSON.parse(existing);
                    if (!Array.isArray(items)) items = [items];
                } catch {
                    items = [];
                }
            }

            // Check if item already exists
            const existingIndex = items.findIndex(item => item.itemId === itemId);

            if (existingIndex !== -1) {
                // ✅ Item exists — update quantity
                items[existingIndex].quantity += countItem;
            } else {
                // 🚀 Item not in cart — add it
                items.push(newItem);
            }

            // Save updated cart back to cookie
            Cookies.set('cartItems', JSON.stringify(items), {
                expires: 7,
                path: '/',
            });

            // Update countCart correctly (by added quantity)
            for (let i = 0; i < countItem; i++) increment();

            // Reset selected item quantity back to 1
            setCountItem(1);
            setShowSuccess(true);


        } catch (err) {
            console.error('Failed to add to cart', err);
        }
    };

    if (loading) {
        return <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    if (error) {
        return <div className="alert alert-danger m-5" role="alert">{error}</div>;
    }

    if (!product) {
        return <div className="alert alert-warning m-5" role="alert">Product not found</div>;
    }

    const { product_data, pricing_list, discount_data, image_data } = product;

    return (
        <div className="container py-3 px-2 d-block">
            <div className="row g-4">
                <div className="col-12 col-md-6">
                    {/* Main product image */}
                    <div className='rounded' style={{ width: '100%', maxHeight: '500px', overflow: 'hidden' }}>
                        <img
                            src={selectedImageIndex === 0 ? product_data.image_url : image_data[selectedImageIndex - 1].image_url}
                            alt={product_data.product_name}
                            className='w-100 h-100 rounded'
                            style={{ objectFit: 'cover', minHeight: '100px' }}
                        />
                    </div>

                    {/* Thumbnail images - horizontal scrolling on mobile */}
                    <div className='d-flex gap-2 my-3 overflow-auto pb-2' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {/* Main image thumbnail */}
                        <div
                            className={`rounded shadow-sm flex-shrink-0 ${selectedImageIndex === 0 ? 'border border-primary' : ''}`}
                            style={{ width: '80px', height: '80px', overflow: 'hidden', cursor: 'pointer' }}
                            onClick={() => setSelectedImageIndex(0)}
                        >
                            <img
                                src={product_data.image_url}
                                alt={product_data.product_name}
                                className='h-100 w-100 rounded'
                                style={{ objectFit: 'cover' }}
                            />
                        </div>

                        {/* Additional image thumbnails */}
                        {image_data.map((image, index) => (
                            <div
                                key={index}
                                className={`rounded shadow-sm flex-shrink-0 ${selectedImageIndex === index + 1 ? 'border border-primary' : ''}`}
                                style={{ width: '80px', height: '80px', overflow: 'hidden', cursor: 'pointer' }}
                                onClick={() => setSelectedImageIndex(index + 1)}
                            >
                                <img
                                    src={image.image_url}
                                    alt={image.alt || product_data.product_name}
                                    className='h-100 w-100 rounded'
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pos-product-info col-12 col-md-6">
                    {/* Product brand */}
                    <div className="pos-product-category" style={{ fontSize: '14px' }}>
                        {product_data.brand_name}
                    </div>

                    {/* Product name */}
                    <h1 className="fs-4 fw-medium">
                        {product_data.product_name}
                    </h1>

                    {/* Product description */}
                    <p className="pos-product-description" style={{ fontSize: '14px' }}>
                        {product_data.description}
                    </p>

                    {/* Product tags - responsive grid */}
                    <div className='my-3 d-flex flex-wrap gap-2'>
                        <span className='p-2 px-3 rounded text-nowrap' style={{ fontSize: '14px', background: StyleColors.backgroundText }}>
                            {Translate(website.Label.AvialableStock)} : {product_data.stock}
                        </span>

                        {discount_data.discount_type && (
                            <span className='p-2 px-3 rounded text-nowrap' style={{ fontSize: '14px', background: StyleColors.backgroundText }}>
                                {discount_data.promotion_title}: {discount_data.discount_type === 'fixed' ? FomatCurrency(discount_data.discounts_value) : `${discount_data.discounts_value}%`}
                            </span>
                        )}


                    </div>

                    {/* Product price */}
                    <div className="pos-product-price d-flex align-items-center flex-wrap gap-2 mb-2">
                        <span className="fw-bold fs-5">{FomatCurrency(pricing_list.final_price)}</span>

                        {pricing_list.discount_price > 0 && (
                            <span className="text-decoration-line-through text-muted">
                                {FomatCurrency(pricing_list.selling_price)}
                            </span>
                        )}
                    </div>

                    {/* Quantity selector */}
                    <div className='my-2'>
                        <div className='py-2 text-start' style={{ fontSize: '14px' }}>
                            {Translate(website.Label.Quantity)} :
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <Button
                                onClick={() => {
                                    if (countItem > 1) {
                                        setCountItem(countItem - 1)
                                    }
                                }}
                                className="btn-sm"
                                style={{ background: 'none', color: StyleColors.appGrayText }}
                            >
                                <AiOutlineMinus size={20} />
                            </Button>
                            <button
                                className="count-number"
                                disabled
                                style={{ fontSize: '14px', width: '30px' }}
                            >
                                {countItem}
                            </button>
                            <Button
                                onClick={() => {
                                    setCountItem(countItem + 1)
                                }}
                                className="btn-sm"
                                style={{ background: 'none', color: StyleColors.appGrayText }}
                            >
                                <GoPlus size={20} />
                            </Button>
                        </div>
                    </div>

                    {/* Action buttons - stack on very small screens */}
                    <div className="d-grid gap-2 mt-3">
                        {/* Add to cart button */}
                        <Button
                            onClick={addToCart}
                            variant="contained"
                            className="w-100 py-2 hover:shadow rounded"
                            style={{ fontSize: '14px', background: StyleColors.componentsColor, color: StyleColors.appBackground }}
                        >
                            {Translate(website.ButtonLabel.AddtoCart)}
                        </Button>

                        {/* Wishlist button */}
                        {/* <Button
                            variant="outlined"
                            className="w-100 py-2 d-flex align-items-center justify-content-center gap-2 hover:shadow rounded"
                            style={{ fontSize: '14px', borderColor: StyleColors.componentsColor, color: StyleColors.componentsColor }}
                        >
                            <FaRegHeart />
                            <span className="d-none d-sm-inline">{Translate(website.ButtonLabel.AddtoWishlist) || 'Add to Wishlist'}</span>
                            <span className="d-inline d-sm-none">Wishlist</span>
                        </Button> */}
                    </div>
                </div>
            </div>

            <SectionHeader text={Translate(website.Label.RelatedProduct)} className='mt-4' />
            <ShowSuccess show={showSuccess} message='Item has been added to cart successfully' onClose={() => {
                setShowSuccess(false)
                navigate(POSRoute.cart)
            }} />
        </div>
    );
}

export default ProductDetails;