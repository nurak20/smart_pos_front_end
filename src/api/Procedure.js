import axios from "axios";
import { hostName } from "./host";
import { getToken } from "./AppConfig";

// Configure API base URL and token
const domainName = hostName();
const BASE_URL_PRODUCT = `http://${domainName}:8085/api/product`;

const token = getToken();
const headers = token ? { "Authorization": `nurak ${token}` } : {};

// Get all products sold report
export const getAllProductSoldReport = () => {
    return axios.get(`${BASE_URL_PRODUCT}/list-product-sold`, { headers });
};
