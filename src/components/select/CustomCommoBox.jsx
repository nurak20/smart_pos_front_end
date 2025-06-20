import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import "./customCommobox.css";
import { IoAccessibility } from "react-icons/io5";
import { StyleColors } from "../../website/extension/Extension";

const CustomCommoBox = ({
    label,
    items,
    searchKey,
    labelKeys,
    onItemSelected,
    fontSize,
    error,
    className,
    placeholder,
    top,
    bottom,
    left,
    right,
    manager,
    defaultValueIndex
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [defaultValue, setDefaultValue] = useState(null);

    // Generate label from multiple keys
    const generateLabel = (item) => {
        if (!item) return "None"; // Label for the null option
        if (!labelKeys || labelKeys.length === 0) return "Unnamed Item";
        return labelKeys.map((key) => item[key]).filter(Boolean).join("  ");
    };

    // Set the default value based on the defaultValueIndex prop when the component loads
    useEffect(() => {
        if (defaultValueIndex !== undefined && items[defaultValueIndex]) {
            setDefaultValue(items[defaultValueIndex]);
        }
    }, [defaultValueIndex, items]);

    // Filter items based on search term with support for single or multiple search keys
    const filteredItems = [
        null, // Add a null option at the beginning
        ...items.filter((item) => {
            if (Array.isArray(searchKey)) {
                return searchKey.some((key) => item[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase()));
            } else if (typeof searchKey === "string") {
                return item[searchKey]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
            }
            return false;
        }),
    ];

    return (
        <>

            <label
                className="pos-input-label"
                style={{ fontSize: `${fontSize - 3}px` }}
            >
                {label}
            </label>
            {/* {error && (
                <span
                    className="validation-error"
                    style={{ fontSize: `${fontSize - 2}px` }}
                >
                    {error}
                </span>
            )} */}

            <div className="pos-form-group " style={{ padding: '12px 0px', marginTop: "7px" }}>
                {/* <div className="">
                    <IoAccessibility size={22} color={StyleColors.appGrayText} />
                </div> */}
                <Autocomplete

                    id="size-small-standard"
                    options={filteredItems}
                    getOptionLabel={(item) => generateLabel(item)}
                    inputValue={searchTerm}
                    onInputChange={(event, newInputValue) => {
                        setSearchTerm(newInputValue);
                    }}
                    onChange={(event, value) => {
                        setDefaultValue(value);
                        if (onItemSelected) onItemSelected(value);
                    }}
                    value={defaultValue}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            className="border-none outline-none focus:border-none focus:outline-none focus:ring-0 focus-visible:outline-none"
                            style={{ fontSize: `${fontSize}px` }}
                            placeholder={placeholder || ""}
                            variant="standard"
                            InputProps={{
                                ...params.InputProps,
                                className: "border-none outline-none focus:border-none focus:outline-none focus:ring-0 focus-visible:outline-none",
                                style: {
                                    fontSize: `${fontSize}px`,
                                    outline: 'none !important',
                                    border: 'none !important'
                                },
                                disableUnderline: true
                            }}
                            InputLabelProps={{
                                style: { fontSize: `${fontSize - 1}px` },
                            }}
                            sx={{
                                '& .MuiInput-root': {
                                    outline: 'none !important',
                                    border: 'none !important',
                                    '&:before': {
                                        display: 'none !important'
                                    },
                                    '&:after': {
                                        display: 'none !important'
                                    },
                                    '&:hover:not(.Mui-disabled):before': {
                                        display: 'none !important'
                                    },
                                    '&:focus': {
                                        outline: 'none !important',
                                        border: 'none !important'
                                    },
                                    '&.Mui-focused': {
                                        outline: 'none !important',
                                        border: 'none !important'
                                    }
                                },
                                '& .MuiInput-input': {
                                    outline: 'none !important',
                                    border: 'none !important',
                                    '&:focus': {
                                        outline: 'none !important',
                                        border: 'none !important',
                                        boxShadow: 'none !important'
                                    }
                                },
                                '& fieldset': {
                                    display: 'none !important'
                                }
                            }}
                        />
                    )}
                    noOptionsText="No results found"
                    classes={{ paper: "custom-combobox-dropdown" }}
                    className="border-none outline-none focus:outline-none focus-visible:outline-none w-full px-3"
                    sx={{
                        '& .MuiAutocomplete-root': {
                            outline: 'none !important',
                            border: 'none !important'
                        },
                        '& .MuiAutocomplete-inputRoot': {
                            outline: 'none !important',
                            border: 'none !important',
                            '&:before': {
                                display: 'none !important'
                            },
                            '&:after': {
                                display: 'none !important'
                            },
                            '&:hover:not(.Mui-disabled):before': {
                                display: 'none !important'
                            },
                            '&:focus': {
                                outline: 'none !important',
                                border: 'none !important'
                            },
                            '&.Mui-focused': {
                                outline: 'none !important',
                                border: 'none !important'
                            }
                        },
                        '& .MuiAutocomplete-input': {
                            outline: 'none !important',
                            border: 'none !important',
                            '&:focus': {
                                outline: 'none !important',
                                border: 'none !important',
                                boxShadow: 'none !important'
                            }
                        },
                        '& fieldset': {
                            display: 'none !important'
                        },

                    }}
                />
            </div>


        </>
    );
};

export default CustomCommoBox;