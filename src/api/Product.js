

import axios from "axios";
import { hostName } from "./host";
import { getToken } from "./AppConfig";

// Configure API base URL and token
const domainName = hostName();
const URL_PRODUCT_API = `http://${domainName}:8085/api/seller/product`;

const token = getToken();
const headers = token ? { "Authorization": `nurak ${token}` } : {};

// API functions

// Fetch all products
export const getAllProduct = () => {
    return axios.get(`${URL_PRODUCT_API}/list-product`, { headers });
};

// Create a new product
export const createProduct = (obj) => {
    return axios.post(`${URL_PRODUCT_API}/create`, obj, { headers });
};

// Fetch product by ID
export const getProductById = (id) => {
    if (token) {
        return axios.get(`${URL_PRODUCT_API}/get/${id}`, { headers });
    } else {
        return Promise.reject(new Error("Authorization token is missing."));
    }
};

// Update a product by ID
export const updateProduct = (id, data) => {
    return axios.put(`${URL_PRODUCT_API}/update/${id}`, data, { headers });
};

// Remove a product by ID
export const removeProductById = (id) => {
    return axios.delete(`${URL_PRODUCT_API}/remove/${id}`, { headers });
};

// Search products by keyword
export const searchProductByKeyword = (keyword) => {
    return axios.get(`${URL_PRODUCT_API}/search?keyword=${encodeURIComponent(keyword)}`, { headers });
};

// Get products by category
export const getProductsByCategory = (category) => {
    return axios.get(`${URL_PRODUCT_API}/category/${category}`, { headers });
};

// Get top-selling products
export const getTopSellingProducts = () => {
    return axios.get(`${URL_PRODUCT_API}/top-selling`, { headers });
};

// Get product inventory count
export const getProductInventoryCount = () => {
    return axios.get(`${URL_PRODUCT_API}/inventory/count`, { headers });
};

// Bulk update product prices
export const bulkUpdateProductPrices = (priceUpdates) => {
    return axios.put(`${URL_PRODUCT_API}/bulk-update-prices`, priceUpdates, { headers });
};

// Get product reviews
export const getProductReviews = (productId) => {
    return axios.get(`${URL_PRODUCT_API}/reviews/${productId}`, { headers });
};

// Add a product review
export const addProductReview = (productId, review) => {
    return axios.post(`${URL_PRODUCT_API}/reviews/${productId}/add`, review, { headers });
};

// Mark product as featured
export const markProductAsFeatured = (id) => {
    return axios.put(`${URL_PRODUCT_API}/mark-featured/${id}`, {}, { headers });
};

// Archive product
export const archiveProduct = (id) => {
    return axios.put(`${URL_PRODUCT_API}/archive/${id}`, {}, { headers });
};
