import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';  // Import the skeleton styles

// SkeletonItem Component
const SkeletonItem = ({ height = 70 }) => {
    return <Skeleton height={height} />;
};

// SkeletonGrid Component
const SkeletonGrid = ({ numRows = 5, numCols = 3, height = 70, gap = 10 }) => {
    return (
        <div
            className="skeleton-grid"
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${numCols}, 1fr)`, // Create columns based on numCols
                gap: `${gap}px`, // Set gap between items
            }}
        >
            {/* Generate rows and columns */}
            {Array.from({ length: numRows }).map((_, rowIndex) => (
                <React.Fragment key={rowIndex}>
                    {Array.from({ length: numCols }).map((_, colIndex) => (
                        <SkeletonItem key={colIndex} height={height} />
                    ))}
                </React.Fragment>
            ))}
        </div>
    );
};

// Default export for SkeletonGrid
export default SkeletonGrid;
