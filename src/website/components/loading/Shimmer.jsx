import React from 'react';
import './shimmer.css';
import { POSSize } from '../../extension/Extension';
const Shimmer = () => {
    const heightImage = POSSize({
        sm: 230,  // Image size for small screens
        md: 150,  // Image size for medium screens
        xl: 160,  // Image size for large screens
        xxl: 200, // Image size for extra large screens
    })
    return (
        <div className="card h-100 border-0 shadow-sm">
            {/* Shimmer Image Placeholder */}
            <div className="position-relative p-3">
                <div className="shimmer shimmer-image" style={{ height: heightImage }}></div>
            </div>

            {/* Shimmer Card Body */}
            <div className="card-body rounded border-0">
                {/* Shimmer Title Placeholder */}
                <div className="shimmer shimmer-text"></div>
                <div className="shimmer shimmer-text" style={{ width: '80%' }}></div>

                {/* Shimmer Price and Actions Placeholder */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                    {/* Shimmer Price Placeholder */}
                    <div className="shimmer shimmer-text" style={{ width: '40%' }}></div>

                    {/* Shimmer Action Icons Placeholder */}
                    <div className="d-flex gap-3">
                        <div className="shimmer shimmer-button"></div>
                        <div className="shimmer shimmer-button"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shimmer;