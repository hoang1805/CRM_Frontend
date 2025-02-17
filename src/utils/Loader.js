import { useNavigate } from "react-router-dom";
import api from "./Axios";
import Client from "./client.manager";

let loadPromise = null; // Lưu trữ trạng thái của request

const load = () => {
    // Nếu đã có dữ liệu hoặc đang load, không gọi API nữa
    if (Object.keys(Client.get()).length !== 0 || loadPromise) {
        return loadPromise;
    }

    // Gọi API và lưu lại promise
    loadPromise = (async () => {
        try {
            const response = await api.get("/api/init.load");
            const data = response.data;

            for (const key in data) {
                Client.register(key, data[key]);
            }
        } catch (err) {
            console.error("Failed to load initial data:", err);
            window.location.pathname = '/login';
            loadPromise = null;
            return Promise.reject(err);
        }

        return Client.get(); // Trả về dữ liệu đã load
    })();

    return loadPromise;
};

export default load;
