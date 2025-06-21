// components/PaymentModal.js
import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import './style.css'; // Optional: add custom styles here

const PaymentModal = ({ id, show, onClose, message, qrValue, totalPay }) => {
    const [showQR, setShowQR] = useState(false);

    useEffect(() => {
        if (!show) {
            setShowQR(false); // reset QR view when modal closes
        }
    }, [show]);

    if (!show) return null;

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            id={id}
            aria-modal="true"
            aria-hidden="false"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        >
            <div className="modal-dialog modal-dialog-centered modal-md" role="document">
                <div className="modal-content payment-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="modal-header bg-light border-0 py-3 px-4">
                        <h5 className="modal-title fw-bold">🔐 Payment</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>

                    <div className="modal-body text-center py-5 px-4">
                        <p className="fs-5 mb-4 text-muted">
                            {message || 'Scan the QR code below to complete your payment.'}
                        </p>
                        <div className="d-flex justify-content-center">
                            <QRCode value={qrValue} size={180} bgColor="#fff" />
                        </div>
                        {
                            totalPay && <p className='fs-5 text-muted mt-3'>
                                ${totalPay.toFixed(2)}
                            </p>
                        }
                    </div>

                    <div className="modal-footer border-0 pb-4 px-4 d-flex justify-content-center">

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
