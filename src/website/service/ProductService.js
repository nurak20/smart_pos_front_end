import axios from "axios";
import { API_BASE_URL, API_ENDPOINT } from "./Api";

export const getAllProductV1 = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}${API_ENDPOINT.GET_ALL_PRODUCTS}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};


export const getDetailProductV1 = async (productId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}${API_ENDPOINT.GET_PRODUCTS_DETAIL}/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getGroupProductByCode = async (code) => {
    try {
        const response = await axios.get(`${API_BASE_URL}${API_ENDPOINT.GET_GROUP_CODE}/${code}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getProdDetail = (id) => {
    const response = axiosGET(API_ENDPOINT.GET_PRODUCTS_DETAIL + '/' + id);
    return response.data;
}