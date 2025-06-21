import axios from "axios";
import { getToken } from "./AppConfig";
import { hostName } from "./host";



const token = getToken();
const headers = {
    "Authorization": `nurak ${token}`
};
const domainName = hostName();

export const uploadImage = async (formData) => {
    try {
        return axios.post(`http://${domainName}:8085/api/images/upload`, formData, { headers }); // Return success response
    } catch (error) {
        // Handle and return error
        throw error.response?.data || "Error uploading file";
    }
};
