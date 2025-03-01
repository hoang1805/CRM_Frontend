import axios from 'axios';

const SERVER_URL = 'http://localhost:8080';
const api = axios.create({
    baseURL: SERVER_URL,
    timeout: 10000,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// Danh sách API không cần CSRF
const EXCLUDED_URLS = ["/api/login", "/api/public"];

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
    if (EXCLUDED_URLS.some(url => config.url.startsWith(url))) {
        return config;
    }

    let csrfToken = getCsrfToken();

    if (!csrfToken) {
        console.log("CSRF hết hạn hoặc không có. Đang refresh...");

        // Tránh refresh liên tục bằng cách kiểm tra flag
        if (!window.isRefreshingCsrf) {
            window.isRefreshingCsrf = true;
            csrfToken = await refreshCsrfToken();
            window.isRefreshingCsrf = false;
        } else {
            console.log("Đang chờ refresh CSRF, không gọi lại.");
            return Promise.reject("CSRF token hết hạn, đang đợi refresh.");
        }

        if (!csrfToken) {
            console.log("Không thể lấy lại CSRF. Chuyển hướng đến đăng nhập.");
            authInstance?.logout();
            window.location.href = "/login";
            return Promise.reject("CSRF token hết hạn, cần đăng nhập lại.");
        }
    }

    config.headers["X-XSRF-TOKEN"] = csrfToken;
    return config;
}, (error) => Promise.reject(error));


// // Interceptor khi nhận response
api.interceptors.response.use(response => response, async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    
    // Kiểm tra API có bị loại trừ không
    const isExcluded = EXCLUDED_URLS.some(url => originalRequest.url.startsWith(url));

    if ((status === 403 || status === 401) && !isExcluded) {
        const reason = error.response?.data?.code; // Lấy code từ server (VD: "FORBIDDEN")
        
        if (!reason && authInstance && authInstance.user) {
            authInstance?.logout();
            window.location.href = "/login";
        }

    }

    return Promise.reject(error);
});

export default api;
