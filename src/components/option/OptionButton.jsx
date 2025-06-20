import React, { useState } from "react";
import PropTypes from "prop-types";
import "./optionbutton.css";

const CircularOptionButton = ({ options, onClick, customClass }) => {
    const [activeOption, setActiveOption] = useState(null);

    const handleOptionClick = (value) => {
        setActiveOption(value);
        onClick(value);
    };

    return (
        <div className={`circular-option-container  ${customClass}`}>
            {options.map((option, index) => (
                <button
                    key={index}
                    className={`circular-option ${activeOption === option.value ? "active" : ""}`}
                    onClick={() => handleOptionClick(option.value)}
                    title={option.label} // Tooltip on hover
                >
                    <div className="circular-content f-16">
                        {option.icon && <i className={`option-icon ${option.icon}`}></i>}
                        <div className="option-label">{option.label}</div>
                    </div>
                </button>
            ))}
        </div>
    );
};

CircularOptionButton.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired, // Option name
            value: PropTypes.any.isRequired, // Option value
            icon: PropTypes.string, // Optional FontAwesome or similar icon class
        })
    ).isRequired,
    onClick: PropTypes.func, // Callback for when an option is clicked
    customClass: PropTypes.string, // Custom class for the container
};

CircularOptionButton.defaultProps = {
    onClick: () => { },
    customClass: "",
};

export default CircularOptionButton;
