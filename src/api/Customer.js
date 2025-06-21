import axios from "axios";
import { hostName } from "./host";
import { getToken } from "./AppConfig";

// Configure API base URL and token
const domainName = hostName();
const BASE_URL_CUSTOMER = `http://${domainName}:8085/api/customer`;

const token = getToken();
const headers = token ? { "Authorization": `nurak ${token}` } : {};

// Customer API Functions


// Get all customers
export const createCustomer = (customer) => {
    return axios.post(`${BASE_URL_CUSTOMER}/create`, customer, { headers });
};


// Get all customers
export const getAllCustomer = () => {
    return axios.get(`${BASE_URL_CUSTOMER}/list-customer`, { headers });
};

// Get customer by ID
export const getCustomer = (id) => {
    return axios.get(`${BASE_URL_CUSTOMER}/get/${id}`, { headers });
};

// Remove customer by ID
export const removeCustomerById = (id) => {
    return axios.delete(`${BASE_URL_CUSTOMER}/remove/${id}`, { headers });
};

// Update customer details
export const updateCustomer = (id, customer) => {
    return axios.put(`${BASE_URL_CUSTOMER}/update/${id}`, customer, { headers });
};
