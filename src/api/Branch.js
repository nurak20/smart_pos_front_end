import axios from "axios";
import { hostName } from "./host";
import { getToken } from "./AppConfig";

// Configure API base URL and token
const domainName = hostName();
const BASE_URL_BRANCH = `http://${domainName}:8085/api/branches`;

const token = getToken();
const headers = token ? { "Authorization": `nurak ${token}` } : {};

// Branch API Functions

// Get all branches
export const getAllBranch = () => {
    return axios.get(`${BASE_URL_BRANCH}/list-branch`, { headers });
};

// Get branch by ID
export const getBranchById = (id) => {
    return axios.get(`${BASE_URL_BRANCH}/get/${id}`, { headers });
};

// Remove branch by ID
export const removeBranchById = (id) => {
    return axios.delete(`${BASE_URL_BRANCH}/remove/${id}`, { headers });
};

// Add a new branch
export const createBranch = (branch) => {
    return axios.post(`${BASE_URL_BRANCH}/create`, branch, { headers });
};

// Update branch by ID
export const updateBranch = (id, branch) => {
    return axios.put(`${BASE_URL_BRANCH}/update/${id}`, branch, { headers });
};

export const getBranchId = () => {
    try {
        const branchId = Cookies.get("branchId");
        if (!branchId) {
            return 0; // Return a default value if the cookie doesn't exist
        }
        return JSON.parse(branchId); // Parse if it exists
    } catch (error) {
        // console.error("Error parsing branchId cookie:", error);
        return 0; // Fallback to default value in case of error
    }
};
