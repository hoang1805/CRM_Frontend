import store from '../redux/store';
import { register, remove, update, clear } from '../redux/client.slice';

class ClientManager {
    constructor() {
        this.listeners = new Set(); // Danh sách component cần cập nhật

        this.state = new Proxy(
            { ...store.getState().client }, // Sao chép dữ liệu từ Redux
            {
                set: (target, key, value) => {
                    if (target[key] !== value) {
                        target[key] = value;
                        this.notify(); // Cập nhật các component khi dữ liệu thay đổi
                    }
                    return true;
                },
            }
        );

        // Lắng nghe Redux
        store.subscribe(() => {
            const newState = store.getState().client;
            for (let key in newState) {
                this.state[key] = newState[key]; // Cập nhật dữ liệu vào Proxy
            }
        });
    }

    notify() {
        this.listeners.forEach((cb) => cb(this.state)); // Cập nhật component
    }

    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback); // Hủy đăng ký khi component unmount
    }

    get(key) {
        if (!key) {
            return this.state;
        }
        
        return this.state[key];
    }

    register(key, value) {
        store.dispatch(register({ key, value }));
    }

    remove(key) {
        store.dispatch(remove(key));
    }

    clear() {
        store.dispatch(clear());
    }

    update(key, value) {
        if (!this.state[key]) {
            return;
        }
        
        store.dispatch(update({ key, value }));
    }
}

const Client = new ClientManager();
export default Client;
