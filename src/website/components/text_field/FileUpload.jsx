import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './style.css';
import { StyleColors, Translate } from '../../extension/Extension';
import { MdDelete, MdCloudUpload } from 'react-icons/md';
import axios from 'axios';
import TextField from './POSTextField';
import { Button } from '@mui/material';

const FileUpload = React.forwardRef(({
    label,
    labelProps = {},
    value,
    id,
    onChange,
    disabled = false,
    required = false,
    error = '',
    size = 'medium',
    className = '',
    accept = 'image/*',
    cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
    ...rest
}, ref) => {
    const [previewUrl, setPreviewUrl] = useState(value || '');
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const sizeMap = {
        small: { padding: '4px 8px', height: 32 },
        medium: { padding: '8px 12px', height: 40 },
        large: { padding: '12px 16px', height: 48 },
    };
    const { padding, height } = sizeMap[size] || sizeMap.medium;

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.secure_url;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await processFile(file);
    };

    const processFile = async (file) => {
        if (!file.type.match('image.*')) {
            alert(Translate({ km: 'សូមជ្រើសរើសឯកសាររូបភាព', en: 'Please select an image file' }));
            return;
        }

        setUploading(true);

        // Create local preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewUrl(event.target.result);
        };
        reader.readAsDataURL(file);

        try {
            // Upload to Cloudinary
            const cloudinaryUrl = await uploadToCloudinary(file);

            // Update the preview with Cloudinary URL (which may have transformations)
            setPreviewUrl(cloudinaryUrl);

            // Return Cloudinary URL through onChange
            if (onChange) {
                onChange({ target: { value: cloudinaryUrl } });
            }
        } catch (error) {
            console.error('Upload failed:', error);
            setPreviewUrl('');
            if (onChange) {
                onChange({ target: { value: '' } });
            }
        } finally {
            setUploading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) await processFile(file);
    };

    const clearImage = () => {
        setPreviewUrl('');
        if (onChange) {
            onChange({ target: { value: '' } });
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        if (!disabled && !uploading) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className={`py-3 ${size} ${className}`.trim()}>

            <div
                className={`position-relative pos-form-group p-2 px-3 ${error ? 'pos-input-field--error' : ''} ${isDragging ? 'drag-active' : ''}`}
                style={{
                    cursor: disabled || uploading ? 'not-allowed' : 'pointer',
                    position: 'relative',
                    minHeight: height
                }}
                onClick={triggerFileInput}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {label && (
                    <label
                        htmlFor={id}
                        className="pos-input-label position-absolute px-1"

                        style={{ color: StyleColors.appGrayText, top: -18, backgroundColor: "white" }}
                        {...labelProps}
                    >
                        {label}<span className='label-required'>{required ? ' *' : ''}</span>
                    </label>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}

                    onChange={handleFileChange}
                    disabled={disabled || uploading}
                    style={{ display: 'none' }}
                    {...rest}
                />

                {uploading ? (
                    <div className="d-flex align-items-center" style={{ padding: '9px 0px' }}>
                        <span style={{ color: StyleColors.appGrayText, marginLeft: '10px' }}>
                            {Translate({ km: 'កំពុងផ្ទុកឡើង...', en: 'Uploading...' })}
                        </span>
                    </div>
                ) : previewUrl ? (
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center" style={{ flex: 1 }}>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{
                                    height: '40px',
                                    borderRadius: '4px',
                                    marginRight: '10px'
                                }}
                            />
                            <span style={{ color: StyleColors.appGrayText }}>
                                {previewUrl.includes('cloudinary.com') ?
                                    Translate({ km: 'រូបភាព Cloudinary', en: 'Cloudinary image' }) :
                                    Translate({ km: 'រូបភាពថ្មី', en: 'New image' })}
                            </span>
                        </div>
                        <Button
                            variant='text'
                            color='error'
                            onClick={(e) => {
                                e.stopPropagation();
                                clearImage();
                            }}
                            style={{ color: StyleColors.danger }}
                            disabled={uploading}
                        >
                            <MdDelete size={20} />
                        </Button>
                    </div>
                ) : (
                    <div className="d-flex align-items-center" style={{ padding: '9px 0px' }}>
                        <MdCloudUpload
                            size={22}
                            color={StyleColors.appGrayText}
                            style={{ marginRight: '10px' }}
                        />
                        <span style={{ color: StyleColors.appGrayText }}>
                            {Translate({
                                km: 'អូសរឺចុចដើម្បីផ្ទុកឡើង',
                                en: 'Drag or click to upload'
                            })}
                        </span>
                    </div>
                )}
            </div>


            {error && <div className="pos-field-error text-end py-1">{error}</div>}

            {/* Hidden input for form submission */}
            <input
                type="hidden"
                ref={ref}
                value={previewUrl.includes('cloudinary.com') ? previewUrl : ''}
            />
        </div>
    );
});

FileUpload.propTypes = {
    ...TextField.propTypes,
    accept: PropTypes.string,
    cloudName: PropTypes.string,
    uploadPreset: PropTypes.string,
};

// Remove props that don't apply to file inputs
delete FileUpload.propTypes.prefixIcon;
delete FileUpload.propTypes.suffixIcon;
delete FileUpload.propTypes.type;

export default FileUpload;