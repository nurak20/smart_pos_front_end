import React from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, TextField as MuiTextField, Paper, Popper } from '@mui/material';
import { styled } from '@mui/material/styles';
import './style.css'; // ensure this file defines .pos-input-... classes
import * as FaIcons from 'react-icons/fa';
import * as VscIcons from "react-icons/vsc";
import * as IoIcon from "react-icons/io";
import { StyleColors, Translate } from '../../extension/Extension';

// Custom styled components to match your TextField design
const StyledPopper = styled(Popper)(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: '8px',
        border: `1px solid ${StyleColors.appGrayText || '#e0e0e0'}`,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        marginTop: '4px',
    },
    '& .MuiAutocomplete-listbox': {
        padding: '8px 0',
        '& .MuiAutocomplete-option': {
            padding: '8px 16px',
            fontSize: '14px',
            '&[aria-selected="true"]': {
                backgroundColor: `${StyleColors.appPrimary || '#1976d2'}20`,
                color: StyleColors.appPrimary || '#1976d2',
            },
            '&:hover': {
                backgroundColor: `${StyleColors.appGrayText || '#000'}10`,
            },
        },
    },
}));

const POSCommobox = React.forwardRef(({
    label,
    labelProps = {},
    value,
    onChange,
    onBlur,
    onFocus,
    options = [],
    disabled = false,
    required = false,
    error = '',
    prefixIcon = null,
    suffixIcon = null,
    size = 'medium',
    fontSize = 16,
    className = '',
    typeIcon = 'fa',
    placeholder,
    multiple = false,
    loading = false,
    noOptionsText = 'No options',
    getOptionLabel = (option) => option?.label || option?.name || option?.toString() || '',
    getOptionValue = (option) => option?.value || option?.id || option,
    renderOption,
    ...rest
}, ref) => {
    // Map size prop to padding and height (same as TextField)
    const sizeMap = {
        small: { padding: '4px 8px', height: 32 },
        medium: { padding: '8px 12px', height: 40 },
        large: { padding: '12px 16px', height: 48 },
    };
    const { padding, height } = sizeMap[size] || sizeMap.medium;

    // Icon pack selection (same as TextField)
    let IconPack;
    switch (typeIcon) {
        case 'vsc':
            IconPack = VscIcons;
            break;
        case 'io':
            IconPack = IoIcon;
            break;
        case 'fa':
        default:
            IconPack = FaIcons;
            break;
    }

    const Prefix = prefixIcon && IconPack[prefixIcon] ? IconPack[prefixIcon] : null;
    const Suffix = suffixIcon && IconPack[suffixIcon] ? IconPack[suffixIcon] : null;

    // Handle value change
    const handleChange = (event, newValue) => {
        if (onChange) {
            // Create a synthetic event-like object for consistency with TextField
            const syntheticEvent = {
                target: {
                    name: rest.name,
                    value: multiple ? newValue?.map(getOptionValue) : getOptionValue(newValue),
                },
            };
            onChange(syntheticEvent);
        }
    };

    // Find selected option(s) from value
    const getSelectedOption = () => {
        if (!value) return multiple ? [] : null;

        if (multiple) {
            return options.filter(option =>
                Array.isArray(value) ? value.includes(getOptionValue(option)) : false
            );
        } else {
            return options.find(option => getOptionValue(option) === value) || null;
        }
    };

    return (
        <div className={`${size} ${className}`.trim()}>
            {label && (
                <label
                    htmlFor={rest.id}
                    className="pos-input-label"
                    style={{ color: StyleColors.appGrayText }}
                    {...labelProps}
                >
                    {label}<span className='label-required'>{required ? ' *' : ''}</span>
                </label>
            )}

            <div className={`pos-form-group p-2 px-3 ${error ? 'pos-input-field--error' : ''}`}>
                {Prefix && (
                    <span style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
                        <Prefix size={22} color={StyleColors.appGrayText} />
                    </span>
                )}

                <Autocomplete
                    ref={ref}
                    options={options}
                    value={getSelectedOption()}
                    onChange={handleChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    multiple={multiple}
                    disabled={disabled}
                    loading={loading}
                    getOptionLabel={getOptionLabel}
                    isOptionEqualToValue={(option, value) => getOptionValue(option) === getOptionValue(value)}
                    noOptionsText={noOptionsText}
                    PopperComponent={StyledPopper}
                    renderOption={renderOption}
                    renderInput={(params) => (
                        <MuiTextField
                            {...params}
                            placeholder={placeholder || `${Translate({
                                km: 'ជ្រើសរើស',
                                en: 'Select',
                            })} ${label}`}
                            variant="standard"
                            InputProps={{
                                ...params.InputProps,
                                disableUnderline: true,
                                style: {
                                    padding: 0,
                                    height: height - 16, // Account for container padding
                                    fontSize,
                                    border: 'none',
                                    outline: 'none',
                                },
                                sx: {
                                    '& .MuiAutocomplete-input': {
                                        padding: '0 !important',
                                        height: 'auto !important',
                                        fontSize: `${fontSize}px !important`,
                                    },
                                    '& .MuiAutocomplete-endAdornment': {
                                        right: Suffix ? '30px !important' : '8px !important',
                                    },
                                },
                            }}
                        />
                    )}
                    sx={{
                        flex: 1,
                        '& .MuiAutocomplete-inputRoot': {
                            padding: '0 !important',
                            border: 'none !important',
                            '&:before, &:after': {
                                display: 'none !important',
                            },
                        },
                    }}
                    {...rest}
                />

                {Suffix && (
                    <span style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                        <Suffix size={22} color={StyleColors.appGrayText} />
                    </span>
                )}
            </div>

            {error && <div className="pos-field-error text-end py-1">{error}</div>}
        </div>
    );
});

POSCommobox.propTypes = {
    label: PropTypes.string,
    labelProps: PropTypes.object,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array,
        PropTypes.object
    ]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    options: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    error: PropTypes.string,
    prefixIcon: PropTypes.string,
    suffixIcon: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    fontSize: PropTypes.number,
    className: PropTypes.string,
    typeIcon: PropTypes.oneOf(['fa', 'vsc', 'io']),
    placeholder: PropTypes.string,
    multiple: PropTypes.bool,
    loading: PropTypes.bool,
    noOptionsText: PropTypes.string,
    getOptionLabel: PropTypes.func,
    getOptionValue: PropTypes.func,
    renderOption: PropTypes.func,
};

export default POSCommobox;