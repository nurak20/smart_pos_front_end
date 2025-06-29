import React, { useState, useEffect } from 'react';
import { Maximize, Lock, Smartphone, Tablet } from 'lucide-react';

// iPad/Mobile Optimized Fullscreen Button Component
export const FullscreenButton = ({
    targetId = null,
    className = '',
    variant = 'primary',
    size = 'medium',
    showIcon = true,
    showText = true,
    onFullscreenChange = null,
    allowExit = false
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [deviceType, setDeviceType] = useState('desktop');

    useEffect(() => {
        // Detect device type
        const userAgent = navigator.userAgent;
        if (/iPad/.test(userAgent)) {
            setDeviceType('ipad');
        } else if (/iPhone|iPod/.test(userAgent)) {
            setDeviceType('iphone');
        } else if (/Android/.test(userAgent)) {
            setDeviceType('android');
        } else {
            setDeviceType('desktop');
        }

        const handleFullscreenChange = () => {
            const fullscreenState = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            );

            setIsFullscreen(fullscreenState);

            // Auto re-enter if locked and somehow exited
            if (!fullscreenState && isLocked && !allowExit) {
                setTimeout(() => {
                    enterFullscreen();
                }, 100);
            }

            if (onFullscreenChange) {
                onFullscreenChange(fullscreenState);
            }
        };

        // Prevent various exit methods when locked
        const preventExit = (event) => {
            if (isLocked && !allowExit) {
                // Prevent ESC key
                if (event.key === 'Escape') {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }

                // Prevent F11 on desktop
                if (event.key === 'F11') {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
            }
        };

        // Prevent right-click context menu when locked
        const preventContextMenu = (event) => {
            if (isLocked && !allowExit) {
                event.preventDefault();
                return false;
            }
        };

        // Prevent touch gestures on mobile that might exit fullscreen
        const preventTouchGestures = (event) => {
            if (isLocked && !allowExit && event.touches.length > 1) {
                event.preventDefault();
            }
        };

        // Add event listeners with proper vendor prefixes
        const events = [
            'fullscreenchange',
            'webkitfullscreenchange',
            'mozfullscreenchange',
            'MSFullscreenChange'
        ];

        events.forEach(event => {
            document.addEventListener(event, handleFullscreenChange);
        });

        document.addEventListener('keydown', preventExit, true);
        document.addEventListener('contextmenu', preventContextMenu);
        document.addEventListener('touchstart', preventTouchGestures, { passive: false });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleFullscreenChange);
            });
            document.removeEventListener('keydown', preventExit, true);
            document.removeEventListener('contextmenu', preventContextMenu);
            document.removeEventListener('touchstart', preventTouchGestures);
        };
    }, [onFullscreenChange, isLocked, allowExit]);

    const enterFullscreen = async () => {
        try {
            const element = targetId ? document.getElementById(targetId) : document.documentElement;

            if (!element) {
                console.error(`Element with id "${targetId}" not found`);
                return;
            }

            // Try different fullscreen methods for cross-browser compatibility
            if (element.requestFullscreen) {
                await element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                await element.webkitRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                await element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                await element.msRequestFullscreen();
            }

            // For iOS Safari, also try to hide the UI
            if (deviceType === 'ipad' || deviceType === 'iphone') {
                // Hide Safari UI on iOS
                window.scrollTo(0, 1);

                // Add meta tag for standalone mode simulation
                let metaTag = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
                if (!metaTag) {
                    metaTag = document.createElement('meta');
                    metaTag.name = 'apple-mobile-web-app-capable';
                    metaTag.content = 'yes';
                    document.head.appendChild(metaTag);
                }
            }

        } catch (error) {
            console.error('Error entering fullscreen:', error);
        }
    };

    const exitFullscreen = async () => {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                await document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                await document.msExitFullscreen();
            }
        } catch (error) {
            console.error('Error exiting fullscreen:', error);
        }
    };

    const toggleFullscreen = async () => {
        if (!isFullscreen) {
            await enterFullscreen();
            setIsLocked(true);
        } else if (allowExit) {
            await exitFullscreen();
            setIsLocked(false);
        }
    };

    // Button size styles - larger for mobile
    const sizeStyles = {
        small: deviceType === 'ipad' ? 'px-4 py-3 text-base' : 'px-3 py-2 text-sm',
        medium: deviceType === 'ipad' ? 'px-6 py-4 text-lg' : 'px-4 py-2 text-base',
        large: deviceType === 'ipad' ? 'px-8 py-6 text-xl' : 'px-6 py-3 text-lg'
    };

    // Button variant styles
    const variantStyles = {
        primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white',
        secondary: 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent',
        ghost: 'text-blue-600 hover:bg-blue-50 active:bg-blue-100',
        danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white',
        locked: 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white cursor-not-allowed'
    };

    // Icon size - larger for mobile/tablet
    const iconSize = deviceType === 'ipad' ? 28 : size === 'small' ? 16 : size === 'large' ? 24 : 20;

    const currentVariant = (isFullscreen && isLocked && !allowExit) ? 'locked' : variant;

    const baseClasses = `
        inline-flex items-center justify-center gap-3 rounded-xl font-semibold transition-all duration-200 
        focus:outline-none focus:ring-4 focus:ring-blue-300 hover:shadow-lg active:scale-95
        touch-manipulation select-none
        ${sizeStyles[size]} ${variantStyles[currentVariant]} ${className}
    `;

    // Get device icon
    const getDeviceIcon = () => {
        switch (deviceType) {
            case 'ipad': return <Tablet size={iconSize} />;
            case 'iphone': return <Smartphone size={iconSize} />;
            default: return <Maximize size={iconSize} />;
        }
    };

    // Determine button content
    const getButtonContent = () => {
        if (isFullscreen && isLocked && !allowExit) {
            return {
                icon: <Lock size={iconSize} />,
                text: deviceType === 'ipad' ? '🔒 iPad Locked' : '🔒 Mobile Locked'
            };
        } else if (isFullscreen && allowExit) {
            return {
                icon: <Lock size={iconSize} />,
                text: 'Exit Fullscreen'
            };
        } else {
            return {
                icon: getDeviceIcon(),
                text: deviceType === 'ipad' ? '📱 iPad Fullscreen' : deviceType === 'iphone' ? '📱 iPhone Fullscreen' : '🖥️ Fullscreen'
            };
        }
    };

    const buttonContent = getButtonContent();

    return (
        <button
            onClick={toggleFullscreen}
            className={baseClasses}
            disabled={isFullscreen && isLocked && !allowExit}
            style={{
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
            }}
        >
            {showIcon && buttonContent.icon}
            {showText && <span>{buttonContent.text}</span>}
        </button>
    );
};