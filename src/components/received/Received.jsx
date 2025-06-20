import React from "react";
import "./rc.css";

const Received = ({ invoice }) => {
    if (!invoice) {
        return <p>Loading invoice details...</p>;
    }
    if (!invoice.orderLines) return

    return (
        <div className="receipt-page">
            {/* Left Panel */}
            <div className="receipt-left-panel">
                <h2 className="receipt-title">Payment & Print</h2>
                <button className="receipt-print-button" onClick={() => window.print()}>
                    Print Invoice
                </button>
                <div className="receipt-payment-methods">
                    <h3 className="receipt-subtitle">Payment Status</h3>
                    <p className="receipt-text">{invoice.paymentStatus}</p>
                </div>
                <div className="receipt-payment-summary">
                    <h3 className="receipt-subtitle">Payment Summary</h3>
                    <p className="receipt-text">
                        <strong>Cash:</strong> ${invoice.cash}
                    </p>
                    <p className="receipt-text">
                        <strong>Exchange:</strong> ${invoice.exchange}
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="receipt-right-panel">
                <h2 className="receipt-title">Invoice Details</h2>
                <p className="receipt-text">
                    <strong>Invoice Number:</strong> {invoice.invoiceNumber}
                </p>
                <p className="receipt-text">
                    <strong>Accepted By (Staff ID):</strong> {invoice.acceptedBy}
                </p>
                <p className="receipt-text">
                    <strong>Table Number:</strong> {invoice.tableNumber}
                </p>
                <p className="receipt-text">
                    <strong>Number of People:</strong> {invoice.numberOfPeople}
                </p>
                <p className="receipt-text">
                    <strong>Total Amount:</strong> ${invoice.totalAmount}
                </p>
                <p className="receipt-text">
                    <strong>Description:</strong> {invoice.description}
                </p>
                <p className="receipt-text">
                    <strong>Order Type:</strong>{" "}
                    {invoice.orderType === 1 ? "Dine-in" : "Takeaway"}
                </p>
                <h3 className="receipt-subtitle">Order Lines:</h3>
                <table className="receipt-table">
                    <thead>
                        <tr>
                            <th className="receipt-table-header">Product ID</th>
                            <th className="receipt-table-header">Price</th>
                            <th className="receipt-table-header">Quantity</th>
                            <th className="receipt-table-header">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.orderLines.map((line) => (
                            <tr key={line.id}>
                                <td className="receipt-table-cell">{line.productId}</td>
                                <td className="receipt-table-cell">
                                    ${line.price.toFixed(2)}
                                </td>
                                <td className="receipt-table-cell">{line.qty}</td>
                                <td className="receipt-table-cell">
                                    ${line.amount.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Received;
