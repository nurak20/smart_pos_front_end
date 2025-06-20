// ProductCard.jsx
import React from 'react';
import './style.css';
import { PosDiv } from '../../extension/ExtensionComponents';
import { FomatCurrency, StyleColors } from '../../extension/Extension';

/**
 * A product card component styled to match the provided image.
 * Props:
 * - product: { product_name, cost_price, image_url, currency, subtitle, subheading }
 * - sx: optional inline style overrides
 * - className: optional additional CSS classes
 * - onClick: click event handler
 */
const ProductCard = ({ product, sx = {}, className = '', onClick = () => { } }) => {
    const {
        product_name,
        cost_price,
        image_url,
        currency = 'KHR',
        subtitle = '',
        subheading = '',
        brand_name,
        selling_price
    } = product;

    return (
        <div
            className={`pos-product-card mb-3 ${className}`.trim()}
            style={sx}
            onClick={onClick}
        >
            <div
                className='mb-3'
                style={{
                    maxWidth: '100%',
                    borderRadius: '10px',
                    background: 'rgb(237, 237, 237)',
                    /* remove fixed height & overflow here */
                }}
            >
                <img
                    // src={image_url}
                    src={image_url}

                    style={{
                        brderRadius: '10px',
                        display: 'block',
                        width: '100%',         // fill container
                        height: 'auto',        // keep aspect ratio
                        height: 200,        // never exceed 200px high
                        objectFit: 'contain'   // show the whole image
                    }}
                />
            </div>
            <div className="d-block">
                <div className='start' style={{ color: StyleColors.appGrayText, fontSize: StyleColors.fontSmall }}>
                    <div>
                        {brand_name}
                    </div>

                </div>
                <div
                    className="f-14"
                    style={{
                        color: StyleColors.appDarkText,
                        fontSize: StyleColors.fontLarge,
                        fontWeight: '450',
                        whiteSpace: 'nowrap',    // <<< force one line
                        overflow: 'hidden',       // <<< hide anything past the box
                        textOverflow: 'ellipsis'  // <<< show “…” at the end
                    }}
                >
                    {product_name}
                </div>

                <div style={{ color: StyleColors.componentsColor, fontSize: StyleColors.fontMedium, }}>
                    {FomatCurrency(selling_price)}
                </div>

            </div>
        </div>
    );
};

export default ProductCard;