import React from 'react';
import './prod.css'; // Ensure this file contains your shimmer styles

const ProductDetailShimmer = () => {
    return (
        <div className="pos-product-detail-shimmer">
            <div className="pos-product-detail-wrapper">
                {/* Left Column: Shimmer for Product Images */}
                <div className="pos-product-images-container">
                    <div className="pos-main-image-container">
                        <div className="pos-shimmer pos-shimmer-main-image"></div>
                    </div>
                    <div className="pos-thumbnails-container">
                        <div className="pos-shimmer pos-shimmer-thumb"></div>
                        <div className="pos-shimmer pos-shimmer-thumb"></div>
                        <div className="pos-shimmer pos-shimmer-thumb"></div>
                        <div className="pos-shimmer pos-shimmer-thumb"></div>
                    </div>
                </div>
                {/* Right Column: Shimmer for Product Details */}
                <div className="pos-product-info-container">
                    <div className="pos-shimmer pos-shimmer-title"></div>
                    <div className="pos-shimmer pos-shimmer-text pos-shimmer-description"></div>
                    <div className="pos-shimmer pos-shimmer-text pos-shimmer-price"></div>
                    <div className="pos-shimmer pos-shimmer-text pos-shimmer-discount"></div>
                    <div className="pos-shimmer pos-shimmer-text pos-shimmer-attributes"></div>
                    <div className="pos-shimmer pos-shimmer-text pos-shimmer-quantity"></div>
                    <div className="pos-shimmer pos-shimmer-button"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailShimmer;
