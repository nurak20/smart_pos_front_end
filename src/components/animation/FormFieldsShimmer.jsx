import React from 'react';


const Shimmer = ({ width = '100%', height = '60px', borderRadius = '4px', className = '' }) => {
    return (
        <div
            className={`shimmer ${className}`}
            style={{ width, height, borderRadius }}
        />
    );
};

export const FormFieldShimmer = ({ rows = 1 }) => {
    return <Shimmer height={`${rows * 60}px`} />;
};

export const ButtonShimmer = ({ width = '150px', height = '50px' }) => {
    return <Shimmer width={width} height={height} />;
};



export default Shimmer;


export const FormFieldsShimmer = ({
    count = 1,
    className = 'col-md-6 col-lg-4 mb-3',
    rows = 1
}) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div key={`shimmer-field-${index}`} className={className}>
                    <FormFieldShimmer rows={rows} />
                </div>
            ))}
        </>
    );
};