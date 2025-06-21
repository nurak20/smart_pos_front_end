import React, { useRef, useState } from 'react';
import Barcode from 'react-barcode';
import './style.css';

export default function BarcodeGenerator() {
    const [value, setValue] = useState('123456789012');
    const barRef = useRef(null);

    // Convert the SVG barcode into a PNG and trigger download
    const handleDownload = () => {
        const svg = barRef.current.querySelector('svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            canvas.toBlob(blob => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `${value}.png`;
                a.click();
            });
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    // Print only the barcode card
    const handlePrint = () => window.print();

    return (
        <div className="page">
            <div className="controls">
                <label>
                    Barcode value:
                    <input
                        type="text"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />
                </label>
                <button onClick={handleDownload} className="btn">
                    Save as PNG
                </button>
                <button onClick={handlePrint} className="btn">
                    Print
                </button>
            </div>

            <div className="card" ref={barRef}>
                <h2>Barcode Preview</h2>
                <Barcode
                    value={value}
                    format="CODE128"
                    width={2}
                    height={80}
                    displayValue
                />
            </div>
        </div>
    );
}
