// components/PaymentModal.js
import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import './style.css'; // Optional: add custom styles here
import { StyleColors, Translate } from '../../extension/Extension';
import { km } from 'date-fns/locale';
import Button from '../Button/Button';
import { color } from 'framer-motion';

export const ShowSuccess = ({ id, show, onClose, message, qrValue, totalPay, content }) => {
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
            <div className="modal-dialog modal-dialog-centered modal-sm shadow-sm" role="document">
                <div className="modal-content dialog-content border-0 shadow-lg rounded-4 overflow-hidden">

                    <div className="modal-body text-center py-3 px-4">

                        <div className="w-100 center" style={{ width: '100px', height: '100px' }}>
                            <img src="https://assets-v2.lottiefiles.com/a/ac84f4ca-116d-11ee-82b0-0781c06c26fa/9xUUVBrbbU.gif" alt="" className=' h-100' />
                        </div>
                        <p className="fs-5 text-muted">
                            {message || ''}
                        </p>

                    </div>
                    <div className="modal-footer bg-light border-0 py-1 center">

                        <Button
                            style={{ background: 'none', color: StyleColors.componentsColor, fontSize: "18px" }}
                            type="button"
                            className=""
                            aria-label="Close"
                            onClick={onClose}
                        >
                            {
                                Translate({
                                    km: "យល់ព្រម",
                                    en: "Okay"
                                })
                            }
                        </Button>
                    </div>


                </div>
            </div>
        </div>
    );
};

