import React from 'react';
import { Box } from '@mui/material';


export const ShimmerTable = ({ rowCount = 5, columnCount = 6 }) => {
    // Generate unique keys for better React reconciliation
    const rows = React.useMemo(() => Array.from({ length: rowCount }), [rowCount]);
    const cols = React.useMemo(() => Array.from({ length: columnCount }), [columnCount]);

    return (
        <Box
            sx={{
                width: '100%',
                overflow: 'hidden',
                'aria-label': 'Loading content' // Accessibility improvement
            }}
        >
            {rows.map((_, rowIndex) => (
                <Box
                    key={`row-${rowIndex}`}
                    sx={{
                        display: 'flex',
                        mb: 3,
                        gap: 3,
                        alignItems: 'center'
                    }}
                >
                    {cols.map((_, colIndex) => (
                        <Box
                            key={`col-${rowIndex}-${colIndex}`}
                            sx={{
                                flex: 1,
                                height: 80,
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: 1,
                                backgroundColor: '#f0f0f0', // Fallback color
                                minWidth: 150 // Ensures consistent sizing
                            }}
                        >
                            {/* Shimmer effect */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shimmer 1.5s infinite linear',
                                    transform: 'translateZ(0)' // Hardware acceleration
                                }}
                            />
                        </Box>
                    ))}
                </Box>
            ))}
        </Box>
    );
};