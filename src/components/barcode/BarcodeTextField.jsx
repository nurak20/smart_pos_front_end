import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { IoArrowBack, IoReader } from 'react-icons/io5';
import { StyleColors } from '../../website/extension/Extension';
import { IconButton } from '@mui/material';

const BarcodeTextField = React.forwardRef(({
    label = 'Barcode Generator',
    value = '',
    onChange = () => { },
    onBarcodeGenerated = () => { },
    showBarcodeOnClick = false,
    disabled = false,
    size = 'medium',
    className = '',
    required,
    labelProps = {},
    id,
    ...rest
}, ref) => {
    const [barcodeImage, setBarcodeImage] = useState('');
    const [showBarcode, setShowBarcode] = useState(false);
    const [uniqueId, setUniqueId] = useState('');
    const canvasRef = useRef(null);
    const [isShowBarCode, setIsShowBarCode] = useState(false);

    // Generate unique ID on component mount
    useEffect(() => {
        refreshBarcode();
    }, []);

    // Generate barcode when value or uniqueId changes
    useEffect(() => {
        if (value || uniqueId) {
            generateBarcode(value || uniqueId);
        }
    }, [value, uniqueId]);

    const refreshBarcode = () => {
        const now = new Date();
        const timestamp = now.getTime();
        const random = Math.floor(Math.random() * 1000);
        const newId = `BC-${timestamp}-${random}`;
        setUniqueId(newId);
    }

    // Generate barcode function
    const generateBarcode = (text) => {
        const barcodeText = uniqueId;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions
        canvas.width = 300;
        canvas.height = 100;

        // Clear and prepare canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Create binary pattern from text
        const binaryPattern = [];
        for (let i = 0; i < barcodeText.length; i++) {
            const charCode = barcodeText.charCodeAt(i);
            binaryPattern.push(...charCode.toString(2).padStart(8, '0').split('').map(Number));
        }

        // Draw barcode
        ctx.fillStyle = 'black';
        let x = 20;
        const barHeight = 60;
        const startY = 20;

        binaryPattern.forEach((bit) => {
            const barWidth = bit ? 2 : 1;
            if (bit) {
                ctx.fillRect(x, startY, barWidth, barHeight);
            }
            x += barWidth;
        });

        // Add text below barcode
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(barcodeText, canvas.width / 2, 90);

        // Convert to image
        const imageData = canvas.toDataURL('image/png');
        setBarcodeImage(imageData);
        setShowBarcode(true);

        // Call the onBarcodeGenerated callback
        onBarcodeGenerated({
            text: barcodeText,
            image: imageData
        });
    };

    // Handle field click
    const handleClick = (e) => {
        e.preventDefault();
        setIsShowBarCode(true);
        generateBarcode(value || uniqueId);
    };

    // Handle input change
    const handleInputChange = (e) => {
        onChange(e); // Propagate the change event
        generateBarcode(e.target.value || uniqueId);
    };

    // Download barcode
    const downloadBarcode = () => {
        if (!barcodeImage) return;
        const link = document.createElement('a');
        link.download = `barcode-${value || uniqueId}.png`;
        link.href = barcodeImage;
        link.click();
    };

    return (
        <div className={`py-3 ${className}`}>
            {/* Hidden canvas for barcode generation */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {/* Input field */}
            <div className='pos-form-group py-2 px-3 flex items-center position-relative'>

                {label && (
                    <label
                        htmlFor={id}
                        className="pos-input-label position-absolute px-1"

                        style={{ color: StyleColors.appGrayText, top: -18, backgroundColor: "white", left: 12 }}
                        {...labelProps}
                    >
                        {label}<span className='label-required'>{required ? ' *' : ''}</span>
                    </label>
                )}

                {barcodeImage && (
                    <img
                        onClick={handleClick}
                        style={{ maxHeight: 40, marginRight: '8px' }}
                        src={barcodeImage}
                        alt="Generated Barcode"
                        className="border border-gray-300 rounded max-w-full cursor-pointer"
                    />
                )}
                <input
                    ref={ref}
                    type="text"
                    value={value || uniqueId}
                    onChange={handleInputChange}
                    className="border-0 pos-input-fields py-[10px] flex-grow"
                    disabled={disabled}
                    {...rest}
                />
                <IconButton
                    className="p-2"
                    onClick={() => refreshBarcode()}
                    disabled={disabled}
                >
                    <IoArrowBack size={22} color={StyleColors.appGrayText} />
                </IconButton>
            </div>

            {/* Barcode display */}
            {showBarcode && barcodeImage && isShowBarCode && (
                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-700">Generated Barcode</h4>
                        <div className="flex space-x-2">
                            <button
                                onClick={downloadBarcode}
                                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                                disabled={disabled}
                            >
                                <span className="mr-1">⬇️</span>
                                Download
                            </button>
                            <button
                                onClick={() => setIsShowBarCode(false)}
                                className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                                disabled={disabled}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <img
                            src={barcodeImage}
                            alt="Generated Barcode"
                            className="border border-gray-300 rounded max-w-full"
                        />
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                        {value || uniqueId}
                    </p>
                </div>
            )}
        </div>
    );
});

BarcodeTextField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBarcodeGenerated: PropTypes.func,
    showBarcodeOnClick: PropTypes.bool,
    disabled: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    className: PropTypes.string,
};

export default BarcodeTextField;