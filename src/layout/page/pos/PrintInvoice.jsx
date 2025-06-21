import React, { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@mui/material';
import { IoPlaySkipForwardCircleOutline } from 'react-icons/io5';
import { BsFiletypePdf } from "react-icons/bs";
import { PiPrinter } from "react-icons/pi";
import { IoCheckmarkDone } from "react-icons/io5";
import { BsCheck2Circle } from "react-icons/bs";
import { getAllProduct } from '../../../api/Product';
import { getAllBranch } from '../../../api/Branch';
import { getAllEmployee } from '../../../api/EmployeeApi';
import Cookies from 'js-cookie';

const Invoice = ({ data }) => {
    if (!data.invoiceItemDto) return null;

    const [invoiceWidth, setInvoiceWidth] = useState('100mm');
    const [invoiceHeight, setInvoiceHeight] = useState('auto');

    useEffect(() => {
        // Retrieve saved width and height from cookies if available
        const savedWidth = Cookies.get('invoiceWidth');
        const savedHeight = Cookies.get('invoiceHeight');

        if (savedWidth) setInvoiceWidth(savedWidth);
        if (savedHeight) setInvoiceHeight(savedHeight);
    }, []);

    const handleWidthChange = (event) => {
        setInvoiceWidth(event.target.value);
        Cookies.set('invoiceWidth', event.target.value);
    };

    const handleHeightChange = (event) => {
        setInvoiceHeight(event.target.value);
        Cookies.set('invoiceHeight', event.target.value);
    };

    const currentDate = new Date();

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;

        return `${month}/${day}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
    };

    return (
        <div>
            {/* <div style={{ marginBottom: '10px' }}>
                <label htmlFor="width">Invoice Width:</label>
                <input
                    type="text"
                    id="width"
                    value={invoiceWidth}
                    onChange={handleWidthChange}
                    placeholder="e.g. 100mm"
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="height">Invoice Height:</label>
                <input
                    type="text"
                    id="height"
                    value={invoiceHeight}
                    onChange={handleHeightChange}
                    placeholder="e.g. auto"
                />
            </div> */}

            <div
                className="invoice"
                id="invoice"
                style={{
                    width: invoiceWidth, // Dynamic width from cookie
                    height: invoiceHeight, // Dynamic height from cookie
                    fontSize: '10px',
                    padding: '10px',
                    lineHeight: '1.5',
                    fontFamily: 'Arial, sans-serif',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <img
                        src="https://cdn-icons-png.freepik.com/512/11801/11801058.png"
                        alt="Logo"
                        style={{ height: '40px' }}
                    />
                    <div>
                        <strong>Nurak FS'KH</strong>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <div className='f-10 text-secondary'>Company's <span>{data.branchName}</span></div>
                    <div className='f-10 text-secondary'>Tel: +885 <span>{data.branchPhoneNumber}</span></div>
                    <div className='f-10 text-secondary'>Order: <span>{data.invoiceNumber}</span></div>

                    <div className='f-10 text-secondary'>Date: <span>{formatDate(new Date())}</span></div>
                    <div className=""><hr /></div>
                    <div className='f-10 text-secondary'>Custoemr Service {data.customerName}</div>
                    <div className='f-10 text-secondary'>Served By {data.stuff}</div>
                    <div className="py-2" style={{ fontSize: '30px', fontWeight: 200 }}>
                        {data.tableNumber}
                    </div>
                </div>
                <table style={{ width: '100%', marginBottom: '10px', fontSize: '10px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #000' }}>
                            <th style={{ textAlign: 'left', width: '100px' }}>Item</th>
                            <th style={{ textAlign: 'right' }}>Qty</th>
                            <th style={{ textAlign: 'right' }}>Price</th>
                            <th style={{ textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.invoiceItemDto.map((line) => (
                            <tr key={line.id}>
                                <td className='py-2'>{line.productName}</td>
                                <td className='py-2' style={{ textAlign: 'right' }}>{line.qty}</td>
                                <td className='py-2' style={{ textAlign: 'right' }}>${line.price}</td>
                                <td className='py-2' style={{ textAlign: 'right' }}>${line.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                    <div><strong>Total:</strong> ${data.totalAmount + data.totalDiscount}</div>
                    <div><strong>Discount:</strong> ${data.totalDiscount}</div>
                    <div><strong>Paid:</strong> ${data.totalAmount}</div>
                    <div><strong>Cash:</strong> ${data.received}</div>
                    <div><strong>Exchange:</strong> ${data.change}</div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div><strong>Payment Status:</strong> {data.paymentStatus}</div>
                    <div><strong>Payment Method</strong> {data.paymentMethod}</div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '10px' }}>
                    <div>Thank you for your purchase!</div>
                    <div>Visit us again!</div>
                </div>
            </div>
        </div>
    );
};


const PrinInvoice = ({ invoiceData, onClick }) => {
    if (!invoiceData || !invoiceData.invoiceItemDto) {
        return <div>Invoice not available or payment not successful.</div>;
    }

    const invoiceRef = useRef();

    const generatePdf = () => {
        const invoiceElement = invoiceRef.current;

        html2canvas(invoiceElement, {
            scale: 2, // Increase scale for better quality rendering
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');

            // Set the width to 80mm, and scale the height accordingly
            const imgWidth = 80; // Fixed width for receipts
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Proportional height based on aspect ratio

            const pdf = new jsPDF('p', 'mm', 'a4'); // Default A4 paper size, dynamic height

            // Add the image to the PDF with the correct scaling
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            // Open the Save PDF dialog
            pdf.save('invoice.pdf'); // This will trigger the save dialog
        });
    };

    const printReceipt = () => {
        const invoiceElement = invoiceRef.current;

        html2canvas(invoiceElement, {
            scale: 2, // Increase scale for better quality rendering
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');

            const imgWidth = 80; // Fixed width for receipts
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const pdf = new jsPDF('p', 'mm', [80, imgHeight]); // Fixed width for receipts

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            // Open the print dialog
            pdf.autoPrint(); // This will trigger the print dialog
            pdf.output('dataurlnewwindow'); // Opens the print dialog in a new window
        });
    };

    return (
        <>
            <div className="container-fluid fixed-top h-100 w-100 p-3">
                <div className="container box-shadow h-100">
                    <div className="row w-100">
                        <div className="col-md-6">

                            <div className="h-50">
                                <div className='fs-4 py-4 text-badges-green text-center mb-3 center'>Payment Successfully <span><BsCheck2Circle /></span></div>
                                <Button variant='contained' startIcon={<BsFiletypePdf />} color='primary' onClick={generatePdf} className='w-100 mb-3 py-4'>
                                    Save Receipt PDF
                                </Button>
                                <Button variant='contained' startIcon={<PiPrinter />} color='info' onClick={printReceipt} className='w-100 mb-3 py-4'>
                                    Print Receipt
                                </Button>
                            </div>

                            <div className="h-50 position-relative">
                                <div className="position-absolute bottom-0 w-100">
                                    <Button variant="contained" color="success" className="w-100 mb-3 py-4 fs-5" onClick={onClick}>
                                        New Order
                                    </Button>
                                </div>
                            </div>



                        </div>
                        <div className="col-md-6 d-flex justify-content-center p-2" style={{ background: 'rgb(234, 234, 234)' }}>
                            <div ref={invoiceRef} style={{ padding: '10px', height: '100%', overflowY: 'scroll', maxWidth: '100%', background: 'white', maxHeight: '100vh' }}>
                                <Invoice data={invoiceData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default PrinInvoice;
