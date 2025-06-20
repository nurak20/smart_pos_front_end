import React, { useState } from "react";
import './tab.css'
import { Button } from "@mui/material";
const Tabs = ({ steps, onSave }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [errors, setErrors] = useState({}); // Track validation errors

    const validateStep = () => {
        if (steps[activeStep].validate) {
            const validationErrors = steps[activeStep].validate();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return false; // Validation failed
            }
        }
        setErrors({}); // Clear errors if validation passes
        return true;
    };

    const goToNextStep = () => {
        if (validateStep()) {
            setActiveStep(activeStep + 1);
        }
    };

    const goToPreviousStep = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <div>
            {/* Tab Headers */}
            <div className="tab-container">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div
                            className={`tab-circle ${activeStep === index
                                ? "active"
                                : index < activeStep
                                    ? "completed"
                                    : ""
                                }`}
                            onClick={() => {
                                if (index < activeStep || validateStep()) {
                                    setActiveStep(index);
                                }
                            }}
                        >
                            {index + 1}
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`tab-line ${index < activeStep ? "completed" : ""
                                    }`}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: "20px", borderRadius: "8px" }}>
                {steps.map((step, index) => (
                    <div
                        key={index}
                        style={{
                            display: activeStep === index ? "block" : "none", // Only show active tab content
                        }}
                    >
                        {step.content(errors)}
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>

                <Button variant="contained" onClick={goToPreviousStep} className="px-4" disabled={activeStep === 0}>
                    Previous
                </Button>

                {activeStep < steps.length - 1 ? (
                    <Button variant="contained" onClick={goToNextStep} className="px-4">
                        Next
                    </Button>
                ) : (
                    <Button variant="contained" onClick={onSave} className='px-4' color="success">
                        Save
                    </Button>

                )}
            </div>
        </div>
    );
};

export default Tabs;