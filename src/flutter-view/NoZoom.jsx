import React, { useEffect, useRef, useCallback } from 'react';

export const NoZoomFlutterView = ({ children, className = "" }) => {
    const containerRef = useRef(null);
    const lastTouchEnd = useRef(0);

    // Prevent ALL touch zoom - no conditions
    const handleTouchStart = useCallback((e) => {
        if (e.touches.length >= 2) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (e.touches.length >= 2) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, []);

    const handleTouchEnd = useCallback((e) => {
        const now = Date.now();
        // Prevent double-tap zoom completely
        if (now - lastTouchEnd.current <= 500) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        lastTouchEnd.current = now;
    }, []);

    // Prevent ALL wheel zoom - no conditions
    const handleWheel = useCallback((e) => {
        // Block all zoom attempts via wheel/trackpad
        if (e.ctrlKey || e.metaKey || Math.abs(e.deltaY) > 100) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, []);

    // Prevent ALL keyboard zoom - no conditions
    const handleKeyDown = useCallback((e) => {
        // Block all zoom keyboard shortcuts
        if ((e.ctrlKey || e.metaKey) &&
            (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0' ||
                e.keyCode === 187 || e.keyCode === 189 || e.keyCode === 48 ||
                e.which === 187 || e.which === 189 || e.which === 48)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, []);

    // Prevent context menu and gestures
    const handleContextMenu = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, []);

    // Prevent drag/select
    const handleDragStart = useCallback((e) => {
        e.preventDefault();
        return false;
    }, []);

    const handleSelectStart = useCallback((e) => {
        e.preventDefault();
        return false;
    }, []);

    // Prevent gesture events (Safari/iPad)
    const handleGestureStart = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, []);

    const handleGestureChange = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, []);

    const handleGestureEnd = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Force viewport settings for iPad
        const setViewport = () => {
            let viewport = document.querySelector('meta[name="viewport"]');
            if (!viewport) {
                viewport = document.createElement('meta');
                viewport.name = 'viewport';
                document.head.appendChild(viewport);
            }
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, shrink-to-fit=no, viewport-fit=cover';
        };

        setViewport();

        // Aggressive event blocking
        const preventOptions = { passive: false, capture: true };

        // Touch events
        container.addEventListener('touchstart', handleTouchStart, preventOptions);
        container.addEventListener('touchmove', handleTouchMove, preventOptions);
        container.addEventListener('touchend', handleTouchEnd, preventOptions);

        // Mouse/trackpad events
        container.addEventListener('wheel', handleWheel, preventOptions);
        container.addEventListener('mousewheel', handleWheel, preventOptions);
        container.addEventListener('DOMMouseScroll', handleWheel, preventOptions);

        // Gesture events (Safari/iPad specific)
        container.addEventListener('gesturestart', handleGestureStart, preventOptions);
        container.addEventListener('gesturechange', handleGestureChange, preventOptions);
        container.addEventListener('gestureend', handleGestureEnd, preventOptions);

        // Selection and context
        container.addEventListener('contextmenu', handleContextMenu, preventOptions);
        container.addEventListener('dragstart', handleDragStart, preventOptions);
        container.addEventListener('selectstart', handleSelectStart, preventOptions);

        // Global keyboard events
        document.addEventListener('keydown', handleKeyDown, preventOptions);

        // Orientation and resize events to maintain viewport
        window.addEventListener('orientationchange', setViewport);
        window.addEventListener('resize', setViewport);

        // Cleanup
        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('mousewheel', handleWheel);
            container.removeEventListener('DOMMouseScroll', handleWheel);
            container.removeEventListener('gesturestart', handleGestureStart);
            container.removeEventListener('gesturechange', handleGestureChange);
            container.removeEventListener('gestureend', handleGestureEnd);
            container.removeEventListener('contextmenu', handleContextMenu);
            container.removeEventListener('dragstart', handleDragStart);
            container.removeEventListener('selectstart', handleSelectStart);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('orientationchange', setViewport);
            window.removeEventListener('resize', setViewport);
        };
    }, []); // Empty dependency array for stability

    return (
        <div
            ref={containerRef}
            className={`w-full h-full select-none ${className}`}
            style={{
                // Absolute zoom prevention
                touchAction: 'none',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                KhtmlUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                userSelect: 'none',

                // Text size control
                WebkitTextSizeAdjust: '100%',
                MozTextSizeAdjust: '100%',
                msTextSizeAdjust: '100%',
                textSizeAdjust: '100%',

                // Display and overflow
                overflow: 'auto', // Changed from 'hidden' to show content
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'none',

                // Hardware acceleration and rendering
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',

                // Additional iOS/Safari specific
                WebkitTapHighlightColor: 'transparent',
                tapHighlightColor: 'transparent',

                // Ensure visibility
                position: 'relative',
                width: '100%',
                height: '100%'
            }}
            // HTML attributes for maximum prevention
            draggable={false}
            onDragStart={handleDragStart}
            onSelectStart={handleSelectStart}
            onContextMenu={handleContextMenu}
            onGestureStart={handleGestureStart}
            onGestureChange={handleGestureChange}
            onGestureEnd={handleGestureEnd}
        >
            {children}
        </div>
    );
};