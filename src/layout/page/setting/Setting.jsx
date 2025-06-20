import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ColorPicker from "../../../components/color/ColorPicker";
import { Button, Grid } from "@mui/material";
import PrinInvoice from "../pos/PrintInvoice";
import InputValidation from "../../../components/input/InputValidation";



// Utility function to manage cookies
const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
};

const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
};

const Invoice = () => {
    const [width, setWidth] = useState(getCookie('invoiceWidth') || '100mm');
    const [height, setHeight] = useState(getCookie('invoiceHeight') || 'auto');

    // Update cookies when width or height changes
    useEffect(() => {
        setCookie('invoiceWidth', width, 365);
        setCookie('invoiceHeight', height, 365);
    }, [width, height]);

    const data = [
        {
            "invoiceNumber": "9398325571",
            "customerName": "សុខ ចាន់",
            "invoiceDate": null,
            "stuff": "Teat Isa",
            "branchName": "Main Company",
            "branchPhoneNumber": "+85512345678",
            "branchAddress": "No. 86A, Street 110, មហាវិថី សហពន្ធ័រុស្ស៊ី (១១០), ភ្នំពេញ",
            "paymentStatus": "COMPLETE",
            "paymentMethod": "CASH",
            "received": 40.0,
            "totalAmount": 30.0,
            "totalDiscount": 40.0,
            "change": 10.0,
            "invoiceItemDto": [
                { "productName": "ងៀតត្រីឆ្លូញស្រែអាំង", "price": 15.0, "qty": 2, "amount": 30.0 },
                { "productName": "កន្ធាយឆាកែង", "price": 20.0, "qty": 3, "amount": 60.0 },
                { "productName": "ផាក់ឡូវអែបសណ្ដែកគួ", "price": 10.0, "qty": 3, "amount": 30.0 }
            ]
        }
    ];

    const invoiceData = data[0];

    const formatDate = (date) => {
        if (!date) return "N/A";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        return `${month}/${day}/${year} ${formattedHours}:${minutes} ${ampm}`;
    };

    return (
        <div>
            <div className="bg-white p-2" style={{ marginBottom: '20px' }}>
                <p className="fs-5 py-3 text-center">Custom Receipt Size</p>
                <InputValidation
                    label='Receipt Width'
                    type='text'
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeHolder={"e.g., 80mm, 100mm, auto"}
                />
                <InputValidation
                    label='Receipt Height'
                    type='text'
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeHolder={"e.g., 600px, auto"}
                />
                {/* <label>
                    Invoice Height:
                    <input
                        type="text"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="e.g., 600px, auto"
                    />
                </label> */}
            </div>

            <div
                style={{
                    width: width,
                    height: height,
                    fontSize: '10px',
                    background: 'rgb(255, 255, 255)',
                    padding: '10px',
                    lineHeight: '1.5',
                    fontFamily: 'Arial, sans-serif',
                    overflow: 'auto',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <img
                        src="https://cdn-icons-png.freepik.com/512/11801/11801058.png"
                        alt="Logo"
                        style={{ height: '40px' }}
                    />
                    <div><strong>Nurak FS'KH</strong></div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <div>Company: {invoiceData.branchName}</div>
                    <div>Tel: {invoiceData.branchPhoneNumber}</div>
                    <div>Order: {invoiceData.invoiceNumber}</div>
                    <div>Date: {formatDate(new Date())}</div>
                    <div>Customer: {invoiceData.customerName}</div>
                    <div>Served By: {invoiceData.stuff}</div>
                </div>

                <table style={{ width: '100%', marginBottom: '10px', fontSize: '10px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #000' }}>
                            <th style={{ textAlign: 'left' }}>Item</th>
                            <th style={{ textAlign: 'right' }}>Qty</th>
                            <th style={{ textAlign: 'right' }}>Price</th>
                            <th style={{ textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceData.invoiceItemDto.map((item, index) => (
                            <tr key={index}>
                                <td>{item.productName}</td>
                                <td style={{ textAlign: 'right' }}>{item.qty}</td>
                                <td style={{ textAlign: 'right' }}>${item.price}</td>
                                <td style={{ textAlign: 'right' }}>${item.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                    <div><strong>Total:</strong> ${invoiceData.totalAmount + invoiceData.totalDiscount}</div>
                    <div><strong>Discount:</strong> ${invoiceData.totalDiscount}</div>
                    <div><strong>Paid:</strong> ${invoiceData.totalAmount}</div>
                    <div><strong>Cash:</strong> ${invoiceData.received}</div>
                    <div><strong>Exchange:</strong> ${invoiceData.change}</div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div><strong>Payment Status:</strong> {invoiceData.paymentStatus}</div>
                    <div><strong>Payment Method:</strong> {invoiceData.paymentMethod}</div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '10px' }}>
                    <div>Thank you for your purchase!</div>
                    <div>Visit us again!</div>
                </div>
            </div>
        </div>
    );
};


const Setting = () => {
    const navigate = useNavigate();
    const [color, setColor] = useState("#123abc"); // Default color

    // Initialize color state from cookies
    useEffect(() => {
        const savedColor = Cookies.get("bg-color");
        if (savedColor) {
            setColor(savedColor); // Use the saved color if it exists
        }
    }, []);
    // Save the color to cookies and navigate back to home
    const save = () => {
        Cookies.set("bg-color", color);
        window.location.href = '/setting'
    };
    // Menu background color state

    const handleColorSelect = (selectedColor) => {
        setColor(selectedColor);
    };

    return (
        <>
            <div>
                <div className="center p-2">
                    <Button variant="contained" color="primary" className="py-3" onClick={save} sx={{ width: '100%', background: color }}>
                        SAVE
                    </Button>
                </div>

                <div className="center">
                    <ColorPicker
                        label="Pick a Color:"
                        defaultColor={color} // Initialize with current color state
                        onColorChange={handleColorSelect} // Update state on color change
                    />
                </div>
                <div className="bg-silver p-2 center" style={{ height: '100%', overflowY: 'scroll' }}>
                    <Invoice />
                </div>
            </div>
        </>
    );
};

export default Setting;
