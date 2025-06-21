import axios from "axios";
import { hostName } from "./host";
import { getToken } from "./AppConfig";

// Get the base URL dynamically
const setHostName = hostName();
const BASE_URL = `http://${setHostName}:8085/api/employee`;

// Service functions for employee API
export const getAllEmployee = () => {
    const token = getToken();
    const headers = token ? { "Authorization": `nurak ${token}` } : {};
    return axios.get(`${BASE_URL}/list-employee`, { headers });
};

export const newEmployee = (employee) => {
    const token = getToken();
    const headers = token ? { "Authorization": `nurak ${token}` } : {};
    return axios.post(`${BASE_URL}/create`, employee, { headers });
};

export const countEmployee = () => {
    const token = getToken();
    const headers = token ? { "Authorization": `nurak ${token}` } : {};
    return axios.get(`${BASE_URL}/count`, { headers });
};

export const getEmployee = (id) => {
    const token = getToken();
    const headers = token ? { "Authorization": `nurak ${token}` } : {};
    return axios.get(`${BASE_URL}/get/${id}`, { headers });
};
export const deleteEmployeeById = (id) => {
    const token = getToken();
    const headers = token ? { "Authorization": `nurak ${token}` } : {};
    return axios.delete(`${BASE_URL}/remove/${id}`, { headers });
};


export const updateEmployee = (id, employee) => {
    const token = getToken();
    const headers = token ? { "Authorization": `nurak ${token}` } : {};
    return axios.put(`${BASE_URL}/update-employee/${id}`, employee, { headers });
};
