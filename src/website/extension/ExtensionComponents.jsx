import { useEffect, useState } from 'react';
import './extension.css'
import { POSSize, StyleColors } from './Extension';


export const POSTextStyle = ({
    text,
    className,
    fontSize = 12,
    textColor = 'rgb(58, 58, 58)',
    maxLines = 1, // Default to 1 line if not specified
    textTransform = 'normal', // Default to normal (no transformation)
}) => {
    const [defualtFontSize, setFontSize] = useState(
        POSSize({
            sm: 16,  // Font size for small screens
            md: 17,  // Font size for medium screens
            xl: 18,  // Font size for large screens
            xxl: 18, // Font size for extra large screens
        })
    );
    // Handle window resize for dynamic font size
    useEffect(() => {
        const handleResize = () => {
            setFontSize(
                POSSize({
                    sm: 16,
                    md: 16,
                    xl: 17,
                    xxl: 18,
                })
            );

        };


        // Add event listener for window resize
        window.addEventListener("resize", handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    return (
        <div
            className={`pos-kantumruy-pro ${className}`}
            style={{
                padding: '0px',
                fontSize: `${fontSize ? fontSize : defualtFontSize}px`,
                fontWeight: 350,
                color: textColor,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: maxLines, // Limit the number of lines
                overflow: 'hidden',
                textOverflow: 'ellipsis', // Add ellipsis for overflow
                whiteSpace: 'normal', // Ensure text wraps
                textTransform: textTransform === 'lower' ? 'lowercase' :
                    textTransform === 'upper' ? 'uppercase' :
                        'none', // Handle text transformation
            }}
        >
            {text}
        </div>
    );
};

export const MainViewConstrainHD = ({ children }) => {
    return (
        <div style={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
        }}>
            {children}
        </div>
    );
};
export const MainViewConstrainFullHD = ({ children }) => {
    return (
        <div style={{
            maxWidth: "3080px",
            margin: "0 auto",
            // Optional: Adds side padding for better responsiveness
            width: "100%",
        }}>
            {children}
        </div>
    );
};
export const POSRows = ({ children, className }) => {
    return (
        <div className={`row ${className}`}>
            {children}
        </div>
    );
};
export const POSColumn = ({ children, className = "", sm = 4, md = 3, lg = 2, xl = 2, xxl = 2, only = 12 }) => {
    // Build class list dynamically
    const columnClasses = [
        only ? `col-${only}` : "", // `only` prop applies only one specific column size
        sm ? `col-sm-${sm}` : "",
        md ? `col-md-${md}` : "",
        lg ? `col-lg-${lg}` : "",
        xl ? `col-xl-${xl}` : "",
        xxl ? `col-xxl-${xxl}` : "",
        className, // Additional custom classes
    ]
        .filter(Boolean) // Removes empty values
        .join(" "); // Creates a clean class string

    return <div className={`${columnClasses} p-0`}>{children}</div>;
};

// app div
export const PosDiv = ({ color = StyleColors.appDarkText, backgroundColor = StyleColors.appBackground, children, className, sx = {} }) => {
    return (
        <div className={className} style={{
            backgroundColor,
            color,
            ...sx,
        }}>
            {children}
        </div>
    )
}