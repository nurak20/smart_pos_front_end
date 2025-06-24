import axios from "axios";

export const API_ENDPOINT = {
    // Auth endpoints
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
    REFRESH_TOKEN: 'auth/refresh',
    LOGOUT: 'auth/logout',

    // Product endpoints
    GET_ALL_PRODUCTS: 'v1/products',
    GET_PRODUCTS_DETAIL: 'v1/products/details',
    GET_GROUP_CODE: 'v1/products/group',
    GET_PRODUCT_BY_ID: 'v1/products',

    // Add more endpoints as needed
    USERS: 'v1/users',
    ADMIN: 'v1/admin',
    DASHBOARD: 'v1/dashboard',
};

// export const API_BASE_URL = 'http://62.146.237.218:3000/api/'; domain
export const API_BASE_URL = 'http://localhost:2000/api/';


export const axiosGET = (endpoint) => {
    return axios.get(API_BASE_URL + endpoint);
};
export const axiosPOST = (endpoint, data) => {
    return axios.post(API_BASE_URL + endpoint, data);
};
export const axiosPUT = (endpoint, data) => {
    return axios.put(API_BASE_URL + endpoint, data);
};
export const axiosDELETE = (endpoint) => {
    return axios.delete(API_BASE_URL + endpoint);
};


