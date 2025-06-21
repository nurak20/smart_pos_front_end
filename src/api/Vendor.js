import axios from "axios";
import { hostName } from "./host";
import { getToken } from "./AppConfig";

// Configure API base URL and token
const domainName = hostName();
const BASE_URL_CATEGORY = `http://${domainName}:8085/api/vendor`;

const token = getToken();
const headers = token ? { "Authorization": `nurak ${token}` } : {};

// Category API Functions

// Get all categories
export const getAllVendor = () => {
    return axios.get(`${BASE_URL_CATEGORY}/list-vendor`, { headers });
};

// Add a new category
export const createVendor = (category) => {
    return axios.post(`${BASE_URL_CATEGORY}/create`, category, { headers });
};

// Get category by ID
export const getVendor = (id) => {
    return axios.get(`${BASE_URL_CATEGORY}/get/${id}`, { headers });
};

// Update category
export const updateVendor = (id, category) => {
    return axios.put(`${BASE_URL_CATEGORY}/update/${id}`, category, { headers });
};

// Delete category by ID
export const deleteVendor = (id) => {
    return axios.delete(`${BASE_URL_CATEGORY}/remove/${id}`, { headers });
};
