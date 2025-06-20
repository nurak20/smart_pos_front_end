import React from "react";
import "./ProductCard.css";
import { hostName } from "../../api/host";
import { Paper } from "@mui/material";

const ProductCard = ({ image, name, price, category, onClick }) => {
    const domainName = hostName();
    const imageUrl = `http://${domainName}:8085/api/images/`
    return (
        <Paper elevation={2} className="tranform-hover pinter" onClick={onClick} sx={{ transition: '0.2s' }}>
            <div className="center p-2 rounded" style={{ height: '120px', overflow: 'hidden' }}>
                <img src={`${imageUrl}${image}`} alt={name} className="h-100 rounded" />
            </div>
            <div className="card-body p-2 pt-0 pe-1">
                <div className="product-name f-16">{name}</div>

                <p className="product-price f-16">${price ? price.toFixed(2) : ''}</p>
            </div>
        </Paper>
    );
};

export default ProductCard;
