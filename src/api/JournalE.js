import axios from "axios";
import { hostName } from "./host";
import { getToken } from "./AppConfig";


// Configure API base URLs and token
const host = hostName();
const BASE_URL_JOURNAL = `http://${host}:8085/api/journal`;
const BASE_URL_TRANSACTION = `http://${host}:8085/api/transaction`;

const token = getToken();
const headers = token ? { "Authorization": `nurak ${token}` } : {};

// Journal API Functions

// Create a new journal
export const createJournal = (journal) => {
    return axios.post(`${BASE_URL_JOURNAL}/create`, journal, { headers });
};

// Get all journals
export const getAllJournal = () => {
    return axios.get(`${BASE_URL_JOURNAL}/list-journal`, { headers });
};

// Get journal by ID
export const getJournalByID = (id) => {
    return axios.get(`${BASE_URL_JOURNAL}/get/${id}`, { headers });
};

// Fetch journal by date range or filters
export const fetchJournal = (objDate) => {
    return axios.post(`${BASE_URL_JOURNAL}/fetch-journal`, objDate, { headers });
};

// Transaction API Functions

// Create a new transaction
export const createTransaction = (transaction) => {
    return axios.post(`${BASE_URL_TRANSACTION}/create`, transaction, { headers });
};
