import axios from "axios";
import { hostName } from "./host";
import { getToken } from "./AppConfig";

// Configure API base URL and token
const domainName = hostName();
const BASE_URL_ACCOUNT_TYPE = `http://${domainName}:8085/api/account-type`;

const token = getToken();
const headers = token ? { "Authorization": `nurak ${token}` } : {};

// Account Type API Functions

// Get all account types
export const getAllAccountType = () => {
    return axios.get(`${BASE_URL_ACCOUNT_TYPE}/list-account-type`, { headers });
};

// Get account type by ID
export const getAccountTypeById = (id) => {
    return axios.get(`${BASE_URL_ACCOUNT_TYPE}/get/${id}`, { headers });
};

// Create a new account type
export const createAccountType = (accountType) => {
    return axios.post(`${BASE_URL_ACCOUNT_TYPE}/create`, accountType, { headers });
};

// Update an account type by ID
export const updateAccountType = (id, accountType) => {
    return axios.put(`${BASE_URL_ACCOUNT_TYPE}/update/${id}`, accountType, { headers });
};

// Remove an account type by ID
export const deleteAccountTypeById = (id) => {
    return axios.delete(`${BASE_URL_ACCOUNT_TYPE}/delete/${id}`, { headers });
};
