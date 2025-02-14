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

api.interceptors.request.use(
    (config) => {
        const csrf = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${config.xsrfCookieName}=`));
        if (csrf) {
            config.headers[config.xsrfHeaderName] = csrf.split('=')[1];
        }

        console.log(config);

        return config;
    },
    (err) => Promise.reject(err)
);

export default api;
