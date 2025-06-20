import React, { useState, useEffect } from "react";
import Button from "./Button"; // Import the Button component
import Buttons from "./Button";

const Calculator = ({ value = "", onInputChange, placeholder }) => {
    const [input, setInput] = useState(value); // Initialize input with the passed value prop

    // Sync the external value if it changes
    useEffect(() => {
        setInput(value);
    }, [value]);

    // Handle button click event
    const handleClick = (buttonValue) => {
        setInput((prevInput) => {
            const newInput = prevInput + buttonValue;
            onInputChange && onInputChange(newInput); // Pass the value back to parent if function exists
            return newInput;
        });
    };

    // Handle backspace
    const handleBackspace = () => {
        setInput((prevInput) => {
            const newInput = prevInput.slice(0, -1);
            onInputChange && onInputChange(newInput); // Pass the value back to parent if function exists
            return newInput;
        });
    };


    // Buttons configuration
    const buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];

    return (
        <div style={{ maxWidth: "100%", width: "100%", textAlign: "center" }}>
            {/* Display */}
            <div className="calculator-display">
                <input
                    placeholder={placeholder ? placeholder : 'Enter value'}
                    type="text"
                    value={input}
                    readOnly
                    style={{
                        fontSize: "20px",
                        padding: "10px",
                        textAlign: "start",
                        width: "100%",
                        borderRadius: '10px'
                        // marginBottom: "10px",
                    }}
                    className="border-0 box-shadow rounded"
                />
            </div>

            {/* Buttons */}
            <div
                className="f-20 w-100"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "5px",
                }}
            >
                {buttons.map((btn, index) => (
                    <Buttons
                        color='primary'
                        key={index}
                        value={btn}
                        onClick={handleClick}
                        className={"key-number"}
                    />
                ))}
                <Buttons
                    value="&larr;"
                    color='error'
                    onClick={handleBackspace}
                    className="button bg-danger key-number"
                />
            </div>
        </div>
    );
};

export default Calculator;
