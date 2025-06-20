import React, { forwardRef } from "react";

const PrintPage = forwardRef((props, ref) => {
    return (
        <div ref={ref} style={{ padding: "20px", textAlign: "center" }}>
            <h1>React Print Example</h1>
            <p>This content will be printed.</p>
            <img
                src="https://via.placeholder.com/200"
                alt="Example"
                style={{ marginTop: "10px" }}
            />
        </div>
    );
});

export default PrintPage;
