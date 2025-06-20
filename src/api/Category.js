import axios from "axios";
import { hostName } from "./host";
import { getToken } from "./AppConfig";

// Configure API base URL and token
const domainName = hostName();
const BASE_URL_CATEGORY = `http://${domainName}:8085/api/categories`;

const token = getToken();
const headers = token ? { "Authorization": `nurak ${token}` } : {};

// Category API Functions

// Get all categories
export const getAllCategory = () => {
    return axios.get(`${BASE_URL_CATEGORY}/list-categories`, { headers });
};

// Add a new category
export const createCategory = (category) => {
    return axios.post(`${BASE_URL_CATEGORY}/create`, category, { headers });
};

// Get category by ID
export const getCategoryById = (id) => {
    return axios.get(`${BASE_URL_CATEGORY}/get-categories/${id}`, { headers });
};

// Update category
export const updateCategory = (id, category) => {
    return axios.put(`${BASE_URL_CATEGORY}/update-categories/${id}`, category, { headers });
};

// Delete category by ID
export const deleteCategoryById = (id) => {
    return axios.delete(`${BASE_URL_CATEGORY}/remove/${id}`, { headers });
};
