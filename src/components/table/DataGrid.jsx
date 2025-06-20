import React, { useState } from "react";
import "./DataGrid.css";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";

// DataGrid Wrapper
export const DataGrid = ({ children }) => {
    return (
        <>
            <div className="container-fluid p-0">
                <div className="data-grid">{children}</div>
            </div>
        </>
    );
};

// Table Header Wrapper
export const Thead = ({ children }) => {
    return (
        <thead>
            <tr>{children}</tr>
        </thead>
    );
};

// Table Header Cell with Sorting and Resizing
export const Th = ({ children, onSort, sortDirection, resizable = false, columnWidth = 150, bg }) => {
    const [width, setWidth] = useState(columnWidth); // Default column width passed as prop
    const [isResizing, setIsResizing] = useState(false);

    const handleMouseDown = (e) => {
        setIsResizing(true);
        const startX = e.clientX;

        const handleMouseMove = (moveEvent) => {
            const newWidth = width + (moveEvent.clientX - startX);
            setWidth(newWidth > 50 ? newWidth : 50); // Minimum width of 50px
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <th style={{ width: `${width}px`, background: bg ? '#05285d' : 'white', color: bg ? 'white' : '#636363' }}>
            <div className="header-cell" onClick={onSort}>
                <span className="ps-2 border-start">{children}</span>
                {sortDirection && (
                    <span className={`sort-icon ${sortDirection}`}>
                        {sortDirection === "asc" ? <IoIosArrowRoundUp className="f-16" /> : <IoIosArrowRoundDown className="f-16" />}
                    </span>
                )}
            </div>
            {resizable && <div className="resizer" onMouseDown={handleMouseDown}></div>}
        </th>
    );
};

// Table Body Wrapper
export const Tbody = ({ children }) => {
    return <tbody>{children}</tbody>;
};

// Table Row
export const Tr = ({ children }) => {
    return <tr>{children}</tr>;
};

// Table Cell
export const Td = ({ children }) => {
    return <td>{children}</td>;
};
