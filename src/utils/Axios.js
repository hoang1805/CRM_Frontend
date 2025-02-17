import axios from 'axios';

const SERVER_URL = 'http://localhost:8080';
const api = axios.create({
    baseURL: SERVER_URL,
    timeout: 10000,
    withCredentials: true, // Enable cookies for cross-origin requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Hàm lấy CSRF từ cookie
function getCsrfToken() {
    return document.cookie.split("; ")
        .find(row => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];
}

// Hàm refresh CSRF token
async function refreshCsrfToken() {
    try {
        await api.get("/csrf-token"); // Gọi API để lấy CSRF mới
        return getCsrfToken(); // Lấy lại token sau khi refresh
    } catch (error) {
        console.error("Không thể refresh CSRF token", error);
        return null;
    }
}

// Interceptor để thêm CSRF token trước mỗi request
api.interceptors.request.use(async (config) => {
    let csrfToken = getCsrfToken();

    if (!csrfToken && config.method !== "get") {
        console.log("CSRF hết hạn hoặc không có. Đang refresh...");
        csrfToken = await refreshCsrfToken();

        if (!csrfToken) {
            console.log("Không thể lấy lại CSRF. Yêu cầu người dùng đăng nhập.");
            window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
            return Promise.reject("CSRF token hết hạn");
        }
    }

    config.headers["X-XSRF-TOKEN"] = csrfToken;
    return config;
}, (error) => Promise.reject(error));

export default api;
