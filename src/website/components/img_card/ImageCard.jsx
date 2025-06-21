import React from 'react'
import './style.css' // CSS uses pos-image-card-* classes with position modifiers

/**
 * Single promotional card component
 * Props:
 * - item: { image, label, title, subtitle, underline }
 * - align: label position string 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
 * - className: additional class names for the root element
 * - ...rest: other props passed to the root div
 */
const PromoGrid = ({
    title,
    item,
    align = 'top-start',
    className = '',
    ...rest
}) => {
    // convert 'top-start' to 'topStart' for CSS modifier
    const positionKey = align
        .split('-')
        .map((part, index) => index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))
        .join('')

    const labelClass = item.label
        ? `pos-image-card__label pos-image-card__label--${positionKey}`
        : ''

    return (
        <div className={`pos-image-card ${className}`} {...rest}>
            <div className="pos-image-card__wrapper" style={{ maxHeight: '250px' }}>
                <img
                    src={item.image}
                    alt={item.title}
                    className="pos-image-card__img"
                />
                {<span className={labelClass}>
                    Sale
                </span>}
            </div>
        </div>
    )
}

export default PromoGrid
