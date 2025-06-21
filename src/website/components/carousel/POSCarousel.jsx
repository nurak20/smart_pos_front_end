import React from 'react';

/**
 * POSCarousel Component
 * @param {{ src: string, alt?: string, caption?: string, description?: string }[]} items - Array of carousel items
 * @param {string} id - Unique ID for the carousel (defaults to 'posCarousel')
 * @param {number} interval - Time in milliseconds between slides (defaults to 5000)
 * @param {string|number} [maxSlideHeight] - CSS max-height for slides (e.g., '400px' or 400)
 */
const POSCarousel = ({ items = [], id = 'posCarousel', interval = 5000, maxSlideHeight }) => {
    if (!items.length) return null;

    // Build inline style for images if maxSlideHeight is specified
    const imgStyle = {};
    if (maxSlideHeight !== undefined && maxSlideHeight !== null) {
        imgStyle.maxHeight = typeof maxSlideHeight === 'number' ? `${maxSlideHeight}px` : maxSlideHeight;
        imgStyle.objectFit = 'cover';

    }

    return (
        <div
            id={id}
            className="carousel slide "
            data-bs-ride="carousel"
            data-bs-interval={interval}
        >
            {/* Indicators */}
            <div className="carousel-indicators">
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        data-bs-target={`#${id}`}
                        data-bs-slide-to={idx}
                        className={idx === 0 ? 'active' : ''}
                        aria-current={idx === 0 ? 'true' : 'false'}
                        aria-label={`Slide ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Slides */}
            <div className="carousel-inner rounded">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className={` carousel-item ${idx === 0 ? 'active' : ''}`}
                    >
                        <img
                            src={item.src}
                            className="d-block w-100"
                            alt={item.alt || `Slide ${idx + 1}`}
                            style={imgStyle}

                        />
                        {(item.caption || item.description) && (
                            <div className="carousel-caption d-none d-md-block">
                                {item.caption && <h5>{item.caption}</h5>}
                                {item.description && <p>{item.description}</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Controls */}
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#${id}`}
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon" aria-hidden="true" />
                <span className="visually-hidden">Previous</span>
            </button>
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#${id}`}
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon" aria-hidden="true" />
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
};

export default POSCarousel;
