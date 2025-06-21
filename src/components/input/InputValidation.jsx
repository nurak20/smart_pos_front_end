import React from "react";
import TextField from "@mui/material/TextField";
import "./inputvalidation.css";

const InputValidation = ({
    label,
    id,
    name,
    type,
    value,
    onChange,
    error,
    fontSize,
    require,
    placeHolder
}) => {
    return (
        <div className="input-wrapper">
            <TextField
                variant="standard"
                color="secondary"
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeHolder}
                label={
                    <span style={{ fontSize: `${fontSize - 1}px` }}>
                        {label}
                        {require && <span className="text-danger ps-3">*</span>}
                    </span>
                }
                error={Boolean(error)}
                helperText={error}
                InputProps={{
                    style: { fontSize: `${fontSize}px` }
                }}
                FormHelperTextProps={{
                    style: { fontSize: `${fontSize - 2}px` }
                }}
                fullWidth
            />
        </div>
    );
};

export default InputValidation;
