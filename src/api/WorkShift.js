import axios from "axios";
import { hostName } from "./host";
import { getToken } from "./AppConfig";

// Configure API base URL and token
const domainName = hostName();
const BASE_URL_CATEGORY = `http://${domainName}:8085/api/work-shift`;

const token = getToken();
const headers = token ? { "Authorization": `nurak ${token}` } : {};

// Category API Functions

// Get all categories
export const getAllWorkShift = () => {
    return axios.get(`${BASE_URL_CATEGORY}/list-work-shift`, { headers });
};

// Add a new category
export const createWorkShift = (ws) => {
    return axios.post(`${BASE_URL_CATEGORY}/create`, ws, { headers });
};

// Get category by ID
export const getWorkShift = (id) => {
    return axios.get(`${BASE_URL_CATEGORY}/get/${id}`, { headers });
};

// Update category
export const updateWorkShift = (id, ws) => {
    return axios.put(`${BASE_URL_CATEGORY}/update/${id}`, ws, { headers });
};

// Delete category by ID
export const deleteWorkShift = (id) => {
    return axios.delete(`${BASE_URL_CATEGORY}/remove/${id}`, { headers });
};
