import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Button from "../Button/Button";
import { POSSize } from "../../extension/Extension";
import "./slide.css";

const POSSlider = ({
  items = [],
  interval = 5000,
  animation = "slide",
  autoSlide = true,
  height = 600,
  showIndicators = true,
  showArrows = true,
  borderRadius = 10,
  navigationPosition = "sides", // "sides" or "bottom-center"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  // Calculate responsive height based on screen size
  const responsiveHeight = useMemo(() =>
    POSSize({
      sm: Math.min(300, height),
      md: Math.min(400, height),
      xl: Math.min(600, height),
      xxl: Math.min(700, height),
    }), [height]);

  // Animation variants based on selected animation type
  const animationVariants = useMemo(() => ({
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    zoom: {
      initial: { scale: 0.9, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.9, opacity: 0 }
    },
    slide: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "-100%" }
    },
    rotate: {
      initial: { rotate: -15, opacity: 0 },
      animate: { rotate: 0, opacity: 1 },
      exit: { rotate: 15, opacity: 0 }
    },
    scale: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 }
    },
    bounce: {
      initial: { y: -30, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
      exit: { y: 30, opacity: 0 }
    },
  }), []);

  // Handle navigation
  const goToNext = useCallback(() => {
    setProgress(0);
    setCurrentIndex(prevIndex => (prevIndex + 1) % items.length);
  }, [items.length]);

  const goToPrevious = useCallback(() => {
    setProgress(0);
    setCurrentIndex(prevIndex => (prevIndex - 1 + items.length) % items.length);
  }, [items.length]);

  const goToSlide = useCallback((index) => {
    setProgress(0);
    setCurrentIndex(index);
  }, []);

  // Auto-slide effect
  useEffect(() => {
    let slideInterval, progressInterval;

    if (autoSlide && !isHovered && !isDragging && items.length > 1) {
      progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 1, 100));
      }, interval / 100);

      slideInterval = setInterval(goToNext, interval);
    }

    return () => {
      clearInterval(slideInterval);
      clearInterval(progressInterval);
    };
  }, [interval, items.length, autoSlide, isHovered, isDragging, goToNext]);

  // Touch event handlers
  const handleDragStart = (e) => {
    setDragStart(e.touches[0].clientX);
    setIsDragging(true);
    setProgress(0);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    setDragDistance(e.touches[0].clientX - dragStart);
  };

  const handleDragEnd = () => {
    if (Math.abs(dragDistance) > 50) {
      dragDistance < 0 ? goToNext() : goToPrevious();
    }
    setDragStart(0);
    setDragDistance(0);
    setIsDragging(false);
  };

  // Guard clause for empty items
  if (!items || items.length === 0) {
    return null;
  }

  // Render navigation buttons based on position preference
  const renderNavigationButtons = () => {
    if (!showArrows || items.length <= 1) return null;

    if (navigationPosition === "bottom-center") {
      return (
        <div className="pos-slider-bottom-controls">
          <Button
            className="pos-slider-arrow"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            <MdKeyboardArrowLeft />
          </Button>
          <Button
            className="pos-slider-arrow"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <MdKeyboardArrowRight />
          </Button>
        </div>
      );
    }

    // Default side positioning
    return (
      <>
        <Button
          className="pos-slider-arrow pos-slider-arrow-prev"
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          <MdKeyboardArrowLeft />
        </Button>
        <Button
          className="pos-slider-arrow pos-slider-arrow-next"
          onClick={goToNext}
          aria-label="Next slide"
        >
          <MdKeyboardArrowRight />
        </Button>
      </>
    );
  };

  return (
    <div
      className="pos-slider-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="pos-slider-wrapper"
        style={{
          height: `${responsiveHeight}px`,
          borderRadius: `${borderRadius}px`,
        }}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {/* Progress bar */}
        {autoSlide && (
          <div
            className="pos-slider-progress"
            style={{ width: `${progress}%` }}
          />
        )}

        {/* Slides */}
        <AnimatePresence mode="wait">
          {items.map((item, index) =>
            index === currentIndex ? (
              <motion.div
                key={index}
                className="pos-slider-slide"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants[animation] || animationVariants.slide}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <img
                  className="pos-slider-image"
                  src={item.image}
                  alt={item.title || `Slide ${index + 1}`}
                />

                {item.title && (
                  <div className="pos-slider-caption">
                    <h3>{item.title}</h3>
                    {item.description && <p>{item.description}</p>}
                  </div>
                )}
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        {/* Navigation arrows - rendered based on position preference */}
        {/* {renderNavigationButtons()} */}
      </div>

      {/* Indicators */}
      {showIndicators && items.length > 1 && (
        <div className="pos-slider-indicators">
          {items.map((_, index) => (
            <button
              key={index}
              className={`pos-slider-indicator ${currentIndex === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default POSSlider;