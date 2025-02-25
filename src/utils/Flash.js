import { message } from "antd";

// Singleton quản lý Flash
const flash = {

    info(text, duration = 2) {
        // flash.show(message, "info");
        message.info(text, duration);
    },

    success(text, duration = 2) {
        // flash.show(message, "success");
        message.success(text, duration);
    },

    warning(text, duration = 2) {
        // flash.show(message, "warning");
        message.warning(text, duration);
    },

    error(text, duration = 2) {
        // flash.show(message, "error");
        message.error(text, duration);
    },
};

export default flash;
