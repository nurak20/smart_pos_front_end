import React, { createContext, useContext, useState } from "react";
import { LanguageContext } from "../provider/Provider";
import { useNavigate } from "react-router-dom";

export const POSSize = ({ sm, md, xl, xxl }) => {
    // Get the current screen width
    const screenWidth = window.innerWidth;

    // Define breakpoints for different screen sizes
    const breakpoints = {
        sm: 640,    // Small screens
        md: 768,    // Medium screens
        xl: 1024,   // Large screens
        xxl: 1280,  // Extra large screens
    };

    // Determine the appropriate font size based on screen width
    if (screenWidth >= breakpoints.xxl) {
        return xxl;
    } else if (screenWidth >= breakpoints.xl) {
        return xl;
    } else if (screenWidth >= breakpoints.md) {
        return md;
    } else {
        return sm;
    }
};


export const FomatCurrency = (number) => {
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(number);
    } catch (error) {

        return number;
    }
};

// Create a context for the language

export const Translate = (translations, defaultLanguage = "en") => {
    const translate = translations != null ? translations : { km: "មិនមានទិន្ន័យ", en: "No Found" }
    const { language } = useContext(LanguageContext); // Get the current language from context
    return translate[language] || translate[defaultLanguage]; // Fallback to defaultLanguage if translation is missing
};


export const StyleColors = {
    /* Pink Palette */
    pink1Bg: "var(--pink-1)",
    pink1Text: "var(--pink-1)",
    pink2Bg: "var(--pink-2)",
    pink2Text: "var(--pink-2)",
    pink3Bg: "var(--pink-3)",
    pink3Text: "var(--pink-3)",
    pink4Bg: "var(--pink-4)",
    pink4Text: "var(--pink-4)",
    pink5Bg: "var(--pink-5)",
    pink5Text: "var(--pink-5)",

    /* Blue Palette */
    blue1Bg: "var(--blue-1)",
    blue1Text: "var(--blue-1)",
    blue2Bg: "var(--blue-2)",
    blue2Text: "var(--blue-2)",
    blue3Bg: "var(--blue-3)",
    blue3Text: "var(--blue-3)",
    blue4Bg: "var(--blue-4)",
    blue4Text: "var(--blue-4)",
    blue5Bg: "var(--blue-5)",
    blue5Text: "var(--blue-5)",

    /* Dark Palette */
    dark1Bg: "var(--dark-1)",
    dark1Text: "var(--dark-1)",
    dark2Bg: "var(--dark-2)",
    dark2Text: "var(--dark-2)",
    dark3Bg: "var(--dark-3)",
    dark3Text: "var(--dark-3)",
    dark4Bg: "var(--dark-4)",
    dark4Text: "var(--dark-4)",
    dark5Bg: "var(--dark-5)",
    dark5Text: "var(--dark-5)",

    /* Green Palette */
    green1Bg: "var(--green-1)",
    green1Text: "var(--green-1)",
    green2Bg: "var(--green-2)",
    green2Text: "var(--green-2)",
    green3Bg: "var(--green-3)",
    green3Text: "var(--green-3)",
    green4Bg: "var(--green-4)",
    green4Text: "var(--green-4)",
    green5Bg: "var(--green-5)",
    green5Text: "var(--green-5)",

    /* Extra Accents */
    accent1Bg: "var(--accent-1)",
    accent1Text: "var(--accent-1)",
    accent2Bg: "var(--accent-2)",
    accent2Text: "var(--accent-2)",
    accent3Bg: "var(--accent-3)",
    accent3Text: "var(--accent-3)",
    accent4Bg: "var(--accent-4)",
    accent4Text: "var(--accent-4)",
    accent5Bg: "var(--accent-5)",
    accent5Text: "var(--accent-5)",

    // style colors
    componentsColor: "var(--components-color)",
    backgroundLightPink: "var(--background-light-pink)",
    appBorder: "var(--app-border)",
    componentsLightColor: "var(--components-light-color)",
    appDarkText: "var(--app-dark-text)",
    appGrayText: "var(--app-gray-text)",
    appBackground: "var(--app-background)",
    buttonLightPink: "var(--button-light-pink)",
    backgroundText: "var(--background-text)",

    fontSmall: "var(--font-size-sm)",
    fontMedium: "var(--font-size-md)",
    fontLarge: "var(--font-size-lg)",
    fontXs: "var(--font-size-xs)",
    ButtonStyle: {
        background: 'linear-gradient(45deg, #e91e63, #f06292)',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: '500',
        maxHeight: '45px',
        color: "white",
        padding: '13px 0px',
        textTransform: "none",
        boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)',
        '&:hover': {
            background: 'linear-gradient(45deg, #c2185b, #e91e63)',
            boxShadow: '0 6px 20px rgba(233, 30, 99, 0.4)',

        },
        '&:active': {

            boxShadow: '0 2px 10px rgba(233, 30, 99, 0.3)',
        },
        '&:disabled': {
            background: '#f5f5f5',
            color: '#bdbdbd',
            boxShadow: 'none',
        },
        transition: 'all 0.3s ease',
    },
    TextFieldStyle: {
        '& .MuiOutlinedInput-root': {
            outline: 'none !important',
            '& fieldset': {
                borderColor: '#e0e0e0',
                borderWidth: '1px',
            },
            '&:hover fieldset': {
                borderColor: '#e91e63',
                borderWidth: '1px',
            },
            '&.Mui-focused fieldset': {
                outline: 'none !important',
                outlineWidth: '0px !important',
                borderColor: '#e91e63',
                borderWidth: '2px',
                boxShadow: 'none !important',
            },
            '&:focus': {
                outline: 'none !important',
                boxShadow: 'none !important',
            },
            '&:focus-visible': {
                outline: 'none !important',
                boxShadow: 'none !important',
            },
        },
        '& .MuiInputLabel-root': {
            '&.Mui-focused': {
                color: '#e91e63',
            },
        },
        '& .MuiOutlinedInput-input': {
            outline: 'none !important',
            boxShadow: 'none !important',
            '&:focus': {
                outline: 'none !important',
                boxShadow: 'none !important',
            },
            '&:focus-visible': {
                outline: 'none !important',
                boxShadow: 'none !important',
            },
        },
    }

};

export const StyleTextField =
{
    '& .MuiOutlinedInput-root': {
        outline: 'none !important',
        '& fieldset': {
            borderColor: '#e0e0e0',
            borderWidth: '1px',
        },
        '&:hover fieldset': {
            borderColor: '#e91e63',
            borderWidth: '1px',
        },
        '&.Mui-focused fieldset': {
            outline: 'none !important',
            outlineWidth: '0px !important',
            borderColor: '#e91e63',
            borderWidth: '2px',
            boxShadow: 'none !important',
        },
        '&:focus': {
            outline: 'none !important',
            boxShadow: 'none !important',
        },
        '&:focus-visible': {
            outline: 'none !important',
            boxShadow: 'none !important',
        },
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': {
            color: '#e91e63',
        },
    },
    '& .MuiOutlinedInput-input': {
        outline: 'none !important',
        boxShadow: 'none !important',
        '&:focus': {
            outline: 'none !important',
            boxShadow: 'none !important',
        },
        '&:focus-visible': {
            outline: 'none !important',
            boxShadow: 'none !important',
        },
    },
}




const TextFieldStyle = {
    '& .MuiOutlinedInput-root': {
        outline: 'none !important',
        maxHeight: '56px', // Set maximum height for the input container
        height: '56px',    // Set fixed height (optional)
        '& fieldset': {
            borderColor: '#e0e0e0',
            borderWidth: '1px',
        },
        '&:hover fieldset': {
            borderColor: '#e91e63',
            borderWidth: '1px',
        },
        '&.Mui-focused fieldset': {
            outline: 'none !important',
            outlineWidth: '0px !important',
            borderColor: '#e91e63',
            borderWidth: '2px',
            boxShadow: 'none !important',
        },
        '&:focus': {
            outline: 'none !important',
            boxShadow: 'none !important',
        },
        '&:focus-visible': {
            outline: 'none !important',
            boxShadow: 'none !important',
        },
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': {
            color: '#e91e63',
        },
    },
    '& .MuiOutlinedInput-input': {
        outline: 'none !important',
        boxShadow: 'none !important',
        maxHeight: '24px',  // Set max height for the actual input text
        height: '24px',     // Set fixed height for input text
        padding: '16px 14px', // Adjust padding as needed
        overflow: 'hidden',   // Hide overflow if text is too long
        textOverflow: 'ellipsis', // Add ellipsis for overflow text
        '&:focus': {
            outline: 'none !important',
            boxShadow: 'none !important',
        },
        '&:focus-visible': {
            outline: 'none !important',
            boxShadow: 'none !important',
        },
    },
};

// Alternative versions with different height options:

// Version 1: Small TextField (40px height)
const TextFieldStyleSmall = {
    '& .MuiOutlinedInput-root': {
        outline: 'none !important',
        maxHeight: '40px',
        height: '40px',
        '& fieldset': {
            borderColor: '#e0e0e0',
            borderWidth: '1px',
        },
        '&:hover fieldset': {
            borderColor: '#e91e63',
            borderWidth: '1px',
        },
        '&.Mui-focused fieldset': {
            outline: 'none !important',
            outlineWidth: '0px !important',
            borderColor: '#e91e63',
            borderWidth: '2px',
            boxShadow: 'none !important',
        },
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': {
            color: '#e91e63',
        },
    },
    '& .MuiOutlinedInput-input': {
        outline: 'none !important',
        boxShadow: 'none !important',
        padding: '8px 12px',
        fontSize: '14px',
    },
};

// Version 2: Large TextField (64px height)
const TextFieldStyleLarge = {
    '& .MuiOutlinedInput-root': {
        outline: 'none !important',
        maxHeight: '64px',
        height: '64px',
        '& fieldset': {
            borderColor: '#e0e0e0',
            borderWidth: '1px',
        },
        '&:hover fieldset': {
            borderColor: '#e91e63',
            borderWidth: '1px',
        },
        '&.Mui-focused fieldset': {
            outline: 'none !important',
            outlineWidth: '0px !important',
            borderColor: '#e91e63',
            borderWidth: '2px',
            boxShadow: 'none !important',
        },
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': {
            color: '#e91e63',
        },
    },
    '& .MuiOutlinedInput-input': {
        outline: 'none !important',
        boxShadow: 'none !important',
        padding: '20px 14px',
        fontSize: '16px',
    },
};

// Version 3: Multiline TextField with max height
const TextFieldStyleMultiline = {
    '& .MuiOutlinedInput-root': {
        outline: 'none !important',
        maxHeight: '120px', // Allow for multiple lines
        overflow: 'auto',   // Add scroll if content exceeds max height
        '& fieldset': {
            borderColor: '#e0e0e0',
            borderWidth: '1px',
        },
        '&:hover fieldset': {
            borderColor: '#e91e63',
            borderWidth: '1px',
        },
        '&.Mui-focused fieldset': {
            outline: 'none !important',
            outlineWidth: '0px !important',
            borderColor: '#e91e63',
            borderWidth: '2px',
            boxShadow: 'none !important',
        },
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': {
            color: '#e91e63',
        },
    },
    '& .MuiOutlinedInput-input': {
        outline: 'none !important',
        boxShadow: 'none !important',
        resize: 'none', // Prevent manual resizing
        '&:focus': {
            outline: 'none !important',
            boxShadow: 'none !important',
        },
    },
};

// Usage examples:
// <TextField sx={TextFieldStyle} />
// <TextField sx={TextFieldStyleSmall} />
// <TextField sx={TextFieldStyleLarge} />
// <TextField multiline rows={3} sx={TextFieldStyleMultiline} />

export {
    TextFieldStyle,
    TextFieldStyleSmall,
    TextFieldStyleLarge,
    TextFieldStyleMultiline
};
