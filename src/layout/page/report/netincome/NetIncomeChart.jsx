import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import ChartComponent from "./ChartComponent"; // Ensure this is your chart component
import RExpense from "../accounting/RExpense"; // Ensure this is your report component
import Expense from "../expense/Expense";
import Revenues from "../revenues/Revenues";

const NetIncomeChart = () => {
  const printRef = useRef(); // Reference for the printable section

  // Function to handle print action
  const handlePrint = useReactToPrint({
    contentRef: printRef, // Correctly use `contentRef` instead of `content`
  });

  return (
    <div>
      {/* Button to trigger print */}
      <button className="button add  mb-3 px-4" onClick={handlePrint}>
        Print
      </button>

      {/* Section to print */}
      <div ref={printRef}>
        <p className="f-16 ps-3 border-start">
          Net Income Reporting
        </p>

        {/* Chart component */}
        <ChartComponent />

        {/* Reports */}
        <div className="row mt-4">
          <div className="col-md-6 col-12">
            <Expense />
          </div>
          <div className="col-md-6 col-12">
            <Revenues />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetIncomeChart;
