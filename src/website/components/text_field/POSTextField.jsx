import React from 'react';
import PropTypes from 'prop-types';
import './style.css'; // ensure this file defines .pos-input-... classes
import { AiOutlineHome } from "react-icons/ai";
import { StyleColors, Translate } from '../../extension/Extension';
import * as FaIcons from 'react-icons/fa';
import * as VscIcons from "react-icons/vsc";
import * as IoIcon from "react-icons/io";

/**
 * A flexible TextField component with optional label, validation, icons, and dynamic sizing.
 */
const TextField = React.forwardRef(({
    label,              // Optional text label displayed above the input
    labelProps = {},     // Additional attributes for the <label>
    value,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    onKeyUp,
    onKeyPress,
    type = 'text',
    name,
    id,
    placeholder,
    disabled = false,
    readOnly = false,
    required = false,
    error = '',
    prefixIcon = null,
    suffixIcon = null,
    size = 'medium',       // small | medium | large
    fontSize = 16,
    className = '',
    typeIcon = 'fa',
    inputProps = {},       // any additional attributes for the <input>
    ...rest
}, ref) => {
    // map size prop to padding and height
    const sizeMap = {
        small: { padding: '4px 8px', height: 32 },
        medium: { padding: '8px 12px', height: 40 },
        large: { padding: '12px 16px', height: 48 },
    };
    const { padding, height } = sizeMap[size] || sizeMap.medium;
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
    const isPassword = type === 'password';
    const [showPassword, setShowPassword] = React.useState(false);
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const Prefix = prefixIcon && IconPack[prefixIcon] ? IconPack[prefixIcon] : null;
    const Suffix = suffixIcon && IconPack[suffixIcon] ? IconPack[suffixIcon] : null;
    const isTextarea = type === 'textarea';

    const PasswordToggleIconComp = isPassword
        ? IconPack[showPassword ? 'IoMdEye' : 'IoMdEyeOff']
        : null;



    return (
        <div className={`py-3 ${size} ${className}`.trim()}>

            <div className={` position-relative pos-form-group p-2 px-3 ${error ? 'pos-input-field--error' : ''}`}>


                {label && (
                    <label
                        htmlFor={id}
                        className="pos-input-label position-absolute px-1"

                        style={{ color: StyleColors.appGrayText, top: -18, backgroundColor: "white" }}
                        {...labelProps}
                    >
                        {label}<span className='label-required'>{required ? ' *' : ''}</span>
                    </label>
                )}

                {Prefix && !isTextarea && (
                    <span>
                        <Prefix size={22} color={StyleColors.appGrayText} />
                    </span>
                )}
                {isTextarea && (
                    <span className='relative' style={{ top: -30 }}>
                        <Prefix size={22} color={StyleColors.appGrayText} />
                    </span>
                )}
                {isTextarea ? (
                    <textarea
                        ref={ref}
                        id={id}
                        name={name}
                        placeholder={placeholder ? placeholder : `${Translate({
                            km: 'សូមបញ្ចូល',
                            en: 'Enter',
                        })} ${label}`}
                        disabled={disabled}
                        readOnly={readOnly}
                        required={required}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        onKeyDown={onKeyDown}
                        onKeyUp={onKeyUp}

                        className={`flex-1 pt-2 bg-transparent border-0 outline-none focus:outline-none resize-none ${disabled ? 'cursor-not-allowed text-gray-400' : 'text-gray-900'
                            }`}
                        style={{ fontSize, minHeight: 100 }}
                        {...inputProps}
                        {...rest}
                    />
                ) : (
                    <input
                        ref={ref}
                        id={id}
                        name={name}
                        type={type == 'password' ? inputType : type}
                        placeholder={placeholder ? placeholder : `${Translate({
                            km: 'សូមបញ្ចូល',
                            en: 'Enter',
                        })} ${label}`}
                        disabled={disabled}
                        readOnly={readOnly}
                        required={required}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        onKeyDown={onKeyDown}
                        onKeyUp={onKeyUp}

                        className={`border-0 pos-input-fields`}
                        style={{ padding, height, fontSize }}
                        {...inputProps}
                        {...rest}
                    />
                )}
                {Suffix && !isPassword && (
                    <span className="" >
                        <Suffix size={22} color={StyleColors.appGrayText} />
                    </span>
                )}

                {PasswordToggleIconComp && (
                    <span
                        className="pos-field-icon"
                        style={{ cursor: 'pointer', color: StyleColors.appGrayText }}
                        onClick={() => setShowPassword((s) => !s)}
                    >

                        <PasswordToggleIconComp size={22} />
                    </span>
                )}

            </div>
            {error && <div className="pos-field-error text-end py-1">{error}</div>}
        </div>
    );
});

TextField.propTypes = {
    label: PropTypes.string,
    labelProps: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onKeyPress: PropTypes.func,
    type: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    error: PropTypes.string,
    prefixIcon: PropTypes.string,
    suffixIcon: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    fontSize: PropTypes.number,
    className: PropTypes.string,
    inputProps: PropTypes.object,
};

export default TextField;
