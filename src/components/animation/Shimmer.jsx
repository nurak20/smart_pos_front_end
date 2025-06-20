import React from 'react';

const Shimmer = ({
    width = '100%',
    height = '60px',
    borderRadius = '8px',
    className = '',
    variant = 'default',
    animated = true,
    speed = 'normal'
}) => {
    const getSpeedDuration = () => {
        switch (speed) {
            case 'slow': return '2s';
            case 'fast': return '0.8s';
            default: return '1.4s';
        }
    };

    const getVariantStyles = () => {
        const baseStyles = {
            width,
            height,
            borderRadius,
            position: 'relative',
            overflow: 'hidden',
            isolation: 'isolate'
        };

        const variants = {
            default: {
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%'
            },
            wave: {
                background: `
          linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.4) 50%, 
            transparent 100%
          ),
          linear-gradient(90deg, #f0f0f0, #e8e8e8, #f0f0f0)
        `,
                backgroundSize: '200% 100%, 100% 100%'
            },
            pulse: {
                background: 'linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0)',
                backgroundSize: '100% 100%'
            },
            gradient: {
                background: 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)',
                backgroundSize: '200% 100%'
            }
        };

        return { ...baseStyles, ...variants[variant] };
    };

    const getAnimationName = () => {
        switch (variant) {
            case 'pulse': return 'shimmerPulse';
            case 'wave': return 'shimmerWave';
            default: return 'shimmerSlide';
        }
    };

    const shimmerStyles = {
        ...getVariantStyles(),
        ...(animated && {
            animation: `${getAnimationName()} ${getSpeedDuration()} ease-in-out infinite`
        })
    };

    return (
        <>
            <style jsx>{`
        @keyframes shimmerSlide {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes shimmerWave {
          0% {
            background-position: -200% 0, 0 0;
          }
          100% {
            background-position: 200% 0, 0 0;
          }
        }

        @keyframes shimmerPulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .shimmer-container {
          display: inline-block;
        }
      `}</style>
            <div
                className={`shimmer-container ${className}`}
                style={shimmerStyles}
                role="progressbar"
                aria-label="Loading content"
            />
        </>
    );
};

// Enhanced form field shimmer with label support
export const FormFieldShimmer = ({
    rows = 1,
    showLabel = true,
    labelWidth = '80px',
    variant = 'default',
    spacing = '12px'
}) => {
    const fieldHeight = rows * 20 + 40; // More realistic field height calculation

    return (
        <div style={{ marginBottom: spacing }}>
            {showLabel && (
                <Shimmer
                    width={labelWidth}
                    height="16px"
                    borderRadius="4px"
                    variant={variant}
                    className="mb-2"
                />
            )}
            <Shimmer
                height={`${fieldHeight}px`}
                borderRadius="6px"
                variant={variant}
            />
        </div>
    );
};

// Enhanced button shimmer with more realistic proportions
export const ButtonShimmer = ({
    width = '120px',
    height = '40px',
    variant = 'default',
    rounded = false
}) => {
    const borderRadius = rounded ? height : '6px';

    return (
        <Shimmer
            width={width}
            height={height}
            borderRadius={borderRadius}
            variant={variant}
        />
    );
};

// Enhanced form fields shimmer with better grid support
export const FormFieldsShimmer = ({
    count = 3,
    className = '',
    rows = 1,
    showLabels = true,
    variant = 'default',
    layout = 'grid' // 'grid', 'stack', 'inline'
}) => {
    const getLayoutStyles = () => {
        switch (layout) {
            case 'grid':
                return {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                    width: '100%'
                };
            case 'inline':
                return {
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px'
                };
            default:
                return {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                };
        }
    };

    return (
        <div className={className} style={getLayoutStyles()}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={`shimmer-field-${index}`}>
                    <FormFieldShimmer
                        rows={rows}
                        showLabel={showLabels}
                        variant={variant}
                    />
                </div>
            ))}
        </div>
    );
};

// Card shimmer for more complex layouts
export const CardShimmer = ({
    hasImage = true,
    imageHeight = '200px',
    hasTitle = true,
    hasSubtitle = true,
    contentLines = 3,
    variant = 'default'
}) => {
    return (
        <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: '#fff'
        }}>
            {hasImage && (
                <Shimmer
                    height={imageHeight}
                    borderRadius="8px"
                    variant={variant}
                    className="mb-4"
                />
            )}

            {hasTitle && (
                <Shimmer
                    width="70%"
                    height="24px"
                    borderRadius="4px"
                    variant={variant}
                    className="mb-3"
                />
            )}

            {hasSubtitle && (
                <Shimmer
                    width="50%"
                    height="16px"
                    borderRadius="4px"
                    variant={variant}
                    className="mb-4"
                />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Array.from({ length: contentLines }).map((_, index) => (
                    <Shimmer
                        key={index}
                        width={index === contentLines - 1 ? '60%' : '100%'}
                        height="14px"
                        borderRadius="3px"
                        variant={variant}
                    />
                ))}
            </div>
        </div>
    );
};

// Demo component to showcase all variants
const ShimmerDemo = () => {
    const variants = ['default', 'wave', 'pulse', 'gradient'];
    const speeds = ['slow', 'normal', 'fast'];

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '30px', color: '#1f2937' }}>Enhanced Shimmer Components</h2>

            {/* Basic Shimmer Variants */}
            <section style={{ marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px', color: '#374151' }}>Shimmer Variants</h3>
                <div style={{ display: 'grid', gap: '20px' }}>
                    {variants.map(variant => (
                        <div key={variant} style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                            <h4 style={{ marginBottom: '12px', textTransform: 'capitalize', color: '#6b7280' }}>{variant}</h4>
                            <Shimmer variant={variant} height="60px" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Speed Variations */}
            <section style={{ marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px', color: '#374151' }}>Animation Speeds</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {speeds.map(speed => (
                        <div key={speed} style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                            <h4 style={{ marginBottom: '12px', textTransform: 'capitalize', color: '#6b7280' }}>{speed}</h4>
                            <Shimmer speed={speed} height="50px" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Form Fields */}
            <section style={{ marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px', color: '#374151' }}>Form Field Shimmers</h3>
                <FormFieldsShimmer count={4} variant="wave" layout="grid" />
            </section>

            {/* Card Layout */}
            <section style={{ marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px', color: '#374151' }}>Card Shimmers</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                    <CardShimmer variant="gradient" />
                    <CardShimmer variant="wave" hasImage={false} />
                    <CardShimmer variant="pulse" contentLines={2} />
                </div>
            </section>

            {/* Buttons */}
            <section>
                <h3 style={{ marginBottom: '20px', color: '#374151' }}>Button Shimmers</h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <ButtonShimmer variant="default" />
                    <ButtonShimmer variant="wave" width="100px" />
                    <ButtonShimmer variant="gradient" rounded={true} width="80px" height="80px" />
                </div>
            </section>
        </div>
    );
};

export default ShimmerDemo;