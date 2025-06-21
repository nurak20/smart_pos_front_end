import React from 'react';
import Shimmer from './Shimmer'; // Import the Shimmer component

const ShimmerList = ({ count = 12 }) => {

    // Create an array with 12 elements to render 12 shimmer placeholders
    const shimmerItems = Array.from({ length: count }, (_, index) => (
        <div className='col-md-4 col-xl-3  col-sm-6 col-12 mb-2' key={index}>
            <Shimmer />
        </div>
    ));

    return (
        <div className="row">
            {shimmerItems.map((shimmer) => shimmer)}
        </div>
    );
};

export default ShimmerList;