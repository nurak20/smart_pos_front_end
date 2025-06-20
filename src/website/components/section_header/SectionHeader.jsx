import React from "react";
import "./style.css"; // Create this CSS file too!

const SectionHeader = ({ text, className }) => {
    return (
        <div className={`section-header ${className}`}>
            <div className="line"></div>
            <span className="text">{text}</span>
            <div className="line"></div>
        </div>
    );
};

export default SectionHeader;
