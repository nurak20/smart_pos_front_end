import axios from "axios";
import { hostName } from "./host";
import { getToken } from "./AppConfig";

// Configure API base URLs and token
const host = hostName();
const BASE_URL_ORDER = `http://${host}:8085/api/order`;
const BASE_URL_ORDER_LINE = `http://${host}:8085/api/order-line`;

const token = getToken();
const headers = token ? { "Authorization": `nurak ${token}` } : {};

// Order API Functions

// Create a new order
export const createOrder = (order) => {
    return axios.post(`${BASE_URL_ORDER}/post-multiple-items`, order, { headers });
};
export const saleItem = (order) => {
    return axios.post(`${BASE_URL_ORDER}/sale`, order, { headers });
};

// List all orders
export const listOrder = () => {
    return axios.get(`${BASE_URL_ORDER}/list-order`, { headers });
};

// Get order by ID
export const getOrderByID = (id) => {
    return axios.get(`${BASE_URL_ORDER}/get/${id}`, { headers });
};

// Get total orders for today
export const totalOrderToday = () => {
    return axios.get(`${BASE_URL_ORDER}/total-order`, { headers });
};

// Order Line API Functions

// Create a new order line
export const createOrderLine = (orderLine) => {
    return axios.post(`${BASE_URL_ORDER_LINE}/create`, orderLine, { headers });
};

// List order lines by order ID
export const listOrderLineByOrderID = (id) => {
    return axios.get(`${BASE_URL_ORDER_LINE}/get-by-order/${id}`, { headers });
};

// Get orders by status
export const listOrdersByStatus = (status) => {
    return axios.get(`${BASE_URL_ORDER}/list-by-status/${status}`, { headers });
};

