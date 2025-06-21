// src/utils/api.js
import axios from 'axios';
import { API_BASE_URL, } from './Api';
import Cookies from 'js-cookie';

// 1. Create an axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Attach token to every request
api.interceptors.request.use(
    config => {
        const token = Cookies.get('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);
const fullUrl = (url) => API_BASE_URL + url;
// 3. Export helper methods
export const POS_GET = (url, config = {}) =>
    api.get(fullUrl(url), config).then(res => res.data);

export const POS_POST = (url, data, config = {}) =>
    api.post(fullUrl(url), data, config).then(res => res.data);

export const POS_PUT = (url, data, config = {}) =>
    api.put(fullUrl(url), data, config).then(res => res.data);

export const POS_DELETE = (url, config = {}) =>
    api.delete(fullUrl(url), config).then(res => res.data);
