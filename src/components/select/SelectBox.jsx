import React, { useState } from 'react';

const SelectBox = ({ categories, setProductData }) => {
    const [categoryName, setCategoryName] = useState("");
    return (
        <div className="input-wrapper" style={{ fontSize: 14 }}>
            <p className="input-label">Category</p>
            <div className="dropdown w-100">
                <div className="w-100 position-relative">
                    {/* Input box styled like a standard input field */}
                    <input
                        type="text"
                        className={`input-box w-100 border-0 ${categoryName ? '' : 'text-secondary'}`}
                        value={categoryName}
                        placeholder="Select a category"
                        onClick={() => {
                            // Open dropdown on click
                            document.getElementById('category-dropdown').classList.toggle('show');
                        }}
                        readOnly
                    />
                    <i className="w-25 text-end">&#10141;</i>
                </div>

                {/* Dropdown menu for category selection */}
                <ul id="category-dropdown" className="dropdown-menu w-100 box-shadow cursor-i mt-1">
                    {categories.map(c => (
                        <li key={c.id}>
                            <a
                                className="dropdown-item pointer"
                                onClick={() => {
                                    setCategoryName(c.name);
                                    setProductData(prevData => ({
                                        ...prevData,
                                        categoryId: c.id
                                    }));
                                    // Close dropdown after selection
                                    document.getElementById('category-dropdown').classList.remove('show');
                                }}
                            >
                                {c.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SelectBox;
