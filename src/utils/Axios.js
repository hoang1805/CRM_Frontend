import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SERVER_URL = 'http://localhost:8080';
const api = axios.create({
    baseURL: SERVER_URL,
    timeout: 10000,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// Danh sách API không cần CSRF
const EXCLUDED_CSRF_URLS = ["/api/login", "/api/public"];

let authInstance = null; // Biến này sẽ lưu `logout()`

export const setAuthInstance = (auth) => {
    authInstance = auth;
};

// Hàm lấy CSRF từ cookie
function getCsrfToken() {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];
}

// Hàm refresh CSRF token
async function refreshCsrfToken() {
    try {
        await api.get("/api/csrf.token"); // Gọi API để refresh CSRF
        return getCsrfToken();
    } catch (error) {
        console.error("Không thể refresh CSRF token", error);
        return null;
    }
}

// Interceptor thêm CSRF token trước request
api.interceptors.request.use(async (config) => {
    if (EXCLUDED_CSRF_URLS.some(url => config.url.startsWith(url))) {
        return config;
    }

    let csrfToken = getCsrfToken();

    if (!csrfToken) {
        console.log("CSRF hết hạn hoặc không có. Đang refresh...");
        csrfToken = await refreshCsrfToken();

        if (!csrfToken && authInstance) {
            console.log("Không thể lấy lại CSRF. Chuyển hướng đến đăng nhập.");
            authInstance.logout(); // Gọi logout từ AuthContext
            window.location.href = "/login";
            return Promise.reject("CSRF token hết hạn, cần đăng nhập lại.");
        }
    }

    config.headers["X-XSRF-TOKEN"] = csrfToken;
    return config;
}, (error) => Promise.reject(error));

export default api;
