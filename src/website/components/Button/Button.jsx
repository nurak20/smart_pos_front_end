import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Ripple Animation
const rippleEffect = keyframes`
  from {
    transform: scale(0);
    opacity: 0.5;
  }
  to {
    transform: scale(4);
    opacity: 0;
  }
`;

// Define default color variants
const colorVariants = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#388e3c',
  danger: '#d32f2f',
  warning: '#f57c00',
  info: '#0288d1',
  dark: '#212121',
  gray: '#9e9e9e',
  default: '#e0e0e0',
};

// Styled Button
const StyledButton = styled.button`
  position: relative;
  overflow: hidden; /* Ensures the ripple effect is contained within the button */
  font-size: 14px;
  font-weight: 400;
  border-radius: ${(props) => props.rounded || 0}px;
  padding: 10px 24px;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease-in-out;
  border: ${(props) =>
    props.variant === 'outline' ? `1px solid ${props.color}` : 'none'};
  background-color: ${(props) =>
    props.variant === 'contained' ? props.color : 'transparent'};
  color: ${(props) =>
    props.variant === 'contained' ? props.text || 'rgb(255,255,255)' : props.color};

  &:hover {
    background-color: ${(props) =>
    props.variant === 'contained'
      ? props.hoverColor || props.color
      : props.hoverBg || 'rgba(0, 0, 0, 0.05)'};
  }

  &:active {
    background-color: ${(props) => props.activeBg || 'inherit'};
    color: ${(props) => props.activeColor || 'inherit'};
    transform: scale(0.98);
  }
`;

// Ripple element
const Ripple = styled.span`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  pointer-events: none;
  animation: ${rippleEffect} 0.6s linear;
  transform: scale(0);
`;

// Button component
const Button = ({
  rounded = 5,
  children,
  variant = 'contained',
  color = 'default',
  hoverColor,
  hoverBg,
  activeBg,
  activeColor,
  text,
  style,
  startIcon, // Icon to be rendered at the start
  endIcon, // Icon to be rendered at the end
  className, // Add className as a prop
  onClick,
  ...rest
}) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = { x, y, size };

    setRipples((prev) => [...prev, newRipple]);

    // Remove the ripple after animation ends
    setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 600);

    if (rest.onClick) {
      rest.onClick(e);
    }
  };

  // Resolve color based on the color prop
  const resolvedColor = colorVariants[color] || color;

  return (
    <StyledButton
      rounded={rounded}
      variant={variant}
      color={resolvedColor}
      hoverColor={hoverColor}
      hoverBg={hoverBg}
      activeBg={activeBg}
      activeColor={activeColor}
      onClick={onClick}
      onMouseDown={handleClick}
      style={style}
      className={className} // Pass the className prop to StyledButton
      {...rest}
    >
      {startIcon && <span className="start-icon">{startIcon}</span>}
      {children}
      {endIcon && <span className="end-icon">{endIcon}</span>}
      {ripples.map((ripple, index) => (
        <Ripple
          key={index}
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </StyledButton>
  );
};

export default Button;
