import axios from "axios";
import AuthService from "../../layout/auth/AuthService";

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

// API Base URLs
export const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'http://62.146.237.218:3000/api/'
    : 'http://localhost:2000/api/';


// Create axios instance with interceptors
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth headers
apiClient.interceptors.request.use(
    (config) => {
        const token = AuthService.getToken();
        console.log('Token:', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(

    (response) => {
        return response.data; // Return only data, not the full axios response
    },
    (error) => {
        // Handle authentication errors
        if (error.response?.status === 401) {
            // Token expired or invalid
            AuthService.logout();
            window.location.href = '/login';
            return Promise.reject(new Error('Session expired. Please login again.'));
        }

        // Handle authorization errors
        if (error.response?.status === 403) {
            return Promise.reject(new Error('Access denied. Insufficient permissions.'));
        }

        // Handle network errors
        if (!error.response) {
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }

        // Return server error message or default
        const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'An unexpected error occurred';

        return Promise.reject({
            ...error,
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data
        });
    }
);

// Enhanced API functions with better error handling
export const axiosGET = async (endpoint, params = {}) => {
    try {

        const response = await apiClient.get(endpoint, { params });
        console.log(response);
        return response;
    } catch (error) {
        console.error(`GET ${endpoint} failed:`, error);
        throw error;
    }
};

export const axiosPOST = async (endpoint, data = {}, config = {}) => {
    try {
        const response = await apiClient.post(endpoint, data, config);
        return response;
    } catch (error) {
        console.error(`POST ${endpoint} failed:`, error);
        throw error;
    }
};

export const axiosPUT = async (endpoint, data = {}, config = {}) => {
    try {
        const response = await apiClient.put(endpoint, data, config);
        return response;
    } catch (error) {
        console.error(`PUT ${endpoint} failed:`, error);
        throw error;
    }
};

export const axiosDELETE = async (endpoint, config = {}) => {
    try {
        const response = await apiClient.delete(endpoint, config);
        return response;
    } catch (error) {
        console.error(`DELETE ${endpoint} failed:`, error);
        throw error;
    }
};

// Backward compatibility with your existing POS functions
export const POS_GET = axiosGET;
export const POS_POST = axiosPOST;
export const POS_PUT = axiosPUT;
export const POS_DELETE = axiosDELETE;

// Specialized API functions for common operations
export const ApiService = {
    // Auth operations
    login: (credentials) => axiosPOST(API_ENDPOINT.LOGIN, credentials),
    register: (userData) => axiosPOST(API_ENDPOINT.REGISTER, userData),
    logout: () => axiosPOST(API_ENDPOINT.LOGOUT),

    // Product operations
    getAllProducts: (params) => axiosGET(API_ENDPOINT.GET_ALL_PRODUCTS, params),
    getProductDetails: (id) => axiosGET(`${API_ENDPOINT.GET_PRODUCTS_DETAIL}/${id}`),
    getGroupCode: () => axiosGET(API_ENDPOINT.GET_GROUP_CODE),
    createProduct: (productData) => axiosPOST(API_ENDPOINT.GET_ALL_PRODUCTS, productData),
    updateProduct: (id, productData) => axiosPUT(`${API_ENDPOINT.GET_ALL_PRODUCTS}/${id}`, productData),
    deleteProduct: (id) => axiosDELETE(`${API_ENDPOINT.GET_ALL_PRODUCTS}/${id}`),

    // User operations (admin only)
    getUsers: (params) => axiosGET(API_ENDPOINT.USERS, params),
    createUser: (userData) => axiosPOST(API_ENDPOINT.USERS, userData),
    updateUser: (id, userData) => axiosPUT(`${API_ENDPOINT.USERS}/${id}`, userData),
    deleteUser: (id) => axiosDELETE(`${API_ENDPOINT.USERS}/${id}`),

    // Dashboard data
    getDashboardData: () => axiosGET(API_ENDPOINT.DASHBOARD),

    // Generic CRUD operations
    get: axiosGET,
    post: axiosPOST,
    put: axiosPUT,
    delete: axiosDELETE,
};

export default ApiService;