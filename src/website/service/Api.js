import axios from "axios";

export const API_ENDPOINT = {
    GET_ALL_PRODUCTS: 'v1/products',
    GET_PRODUCTS_DETAIL: 'v1/products/details',
    GET_GROUP_CODE: 'v1/products/group',
    GET_PRODUCTS_DETAIL: 'v1/products',
    // ... other endpoints
};

export const API_BASE_URL = 'http://62.146.237.218:3000/api/';


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