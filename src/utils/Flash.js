import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

// Đảm bảo div#flash tồn tại trong DOM
const flashRoot =
    document.getElementById("flash") ||
    (() => {
        const div = document.createElement("div");
        div.id = "flash";
        document.body.appendChild(div);
        return div;
    })();

// Component FlashMessage hiển thị khi có thông báo
const types = {
    info: {
        container: 'alert-info',
        icon: 'icon-[tabler--info-circle]'
    },
    success: {
        container: 'alert-success',
        icon: 'icon-[tabler--circle-check]'
    },
    warning: {
        container: 'alert-warning',
        icon: 'icon-[tabler--alert-triangle]'
    },
    error: {
        container: 'alert-error',
        icon: 'icon-[tabler--info-circle]'
    },
};
const FlashComponent = ({ message, type }) => {
    if (!message) return null;


    return createPortal(
        <div
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 alert flex items-center gap-4 transition-all duration-500 cursor-pointer ${types[type].container}`}
            style={{ width: "500px", animation: "slide-down 0.5s ease-out, fade-out 0.5s ease-in 1s forwards", 'zIndex': 1001 }}
            role="alert"
        >
            <span className={`size-6 ${types[type].icon}`}></span>
            <p>{message}</p>
        </div>,
        flashRoot
    );
};

// Singleton quản lý Flash
const flash = {
    setFlashState: null,

    // Hiển thị thông báo
    show(message, type = "info", duration = 1000) {
        if (flash.setFlashState) {
            flash.setFlashState({ message, type });

            setTimeout(() => {
                flash.clear();
            }, duration);
        }
    },

    // Ẩn thông báo
    clear() {
        if (flash.setFlashState) {
            flash.setFlashState({message: null, type: "info", duration: 1000});
        }
    },

    // Hook sử dụng trong App
    useFlash() {
        const [flashState, setState] = useState({message: null, type: "info", duration: 1000});
        useEffect(() => {
            flash.setFlashState = setState;
            return () => {
                flash.setFlashState = null;
            };
        }, []);
        return flashState ? <FlashComponent {...flashState} /> : null;
    },

    info(message) {
        flash.show(message, "info");
    },

    success(message) {
        flash.show(message, "success");
    },

    warning(message) {
        flash.show(message, "warning");
    },

    error(message) {
        flash.show(message, "error");
    },
};

export default flash;
