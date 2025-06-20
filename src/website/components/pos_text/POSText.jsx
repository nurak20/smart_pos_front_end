import React from "react";

const POSText = ({
    text = "Default Text",

    // Responsive font sizes using clamp() (Min Size, Preferred Size, Max Size)
    fontSize = {
        sm: "clamp(12px, 2vw, 14px)",  // Small Screens
        md: "clamp(14px, 2.5vw, 16px)", // Medium Screens (Default)
        lg: "clamp(16px, 3vw, 18px)",  // Large Screens
        xl: "clamp(18px, 3.5vw, 20px)"  // Extra Large Screens
    },
    size = "md", // Default font size category
    className = '',
    fontWeight = "450",  // Normal weight // Default font
    color = "var(--dark-1)", // Default color
    textAlign = "left", // Default alignment
    textTransform = "none", // Capitalization
    letterSpacing = "normal", // Spacing between letters
    lineHeight = "var(--line-height-md)", // Default line height
    textDecoration = "none", // Underline, Overline, etc.
    backgroundColor = "transparent", // Text background
    // Allows proper text wrapping

    // Overflow handling
    overflow = "hidden",
    maxLines = null, // Max lines before cutting text

    style = {}, // Additional styles (overrides)
}) => {
    return (
        <div
            className={className}
            style={{
                fontSize: fontSize[size], // Responsive size
                fontWeight,

                color,
                textAlign,
                textTransform,
                letterSpacing,
                lineHeight,
                textDecoration,
                backgroundColor,
                overflow,
                ...(maxLines
                    ? {
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: maxLines,
                        whiteSpace: "normal",
                    }
                    : {}),
                ...style, // Allows additional inline styles
            }}
        >
            {text}
        </div>
    );
};

export default POSText;
