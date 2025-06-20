import axios from "axios";
import { hostName } from "./host";
import { getToken } from "./AppConfig";

// Configure API base URL and token
const domainName = hostName();
const BASE_URL_ACCOUNT = `http://${domainName}:8085/api/account`;

const token = getToken();
const headers = token ? { "Authorization": `nurak ${token}` } : {};

// Account API Functions

// Create a new account
export const createAccount = (account) => {
    return axios.post(`${BASE_URL_ACCOUNT}/create`, account, { headers });
};

// Get all accounts
export const getAllAccount = () => {
    return axios.get(`${BASE_URL_ACCOUNT}/list-account`, { headers });
};

// Get account by ID
export const getAccountById = (id) => {
    return axios.get(`${BASE_URL_ACCOUNT}/get/${id}`, { headers });
};

// Update an account by ID
export const updateAccount = (id, account) => {
    return axios.put(`${BASE_URL_ACCOUNT}/update/${id}`, account, { headers });
};

// Delete an account by ID
export const deleteAccountById = (id) => {
    return axios.delete(`${BASE_URL_ACCOUNT}/delete/${id}`, { headers });
};
