const AppEvent = () => {
    const handlers = {}; // Chuyển từ mảng sang object

    const register = (class_name, handler) => {
        handlers[class_name] = handler;
    };

    const dispatch = (url, payload) => {
        try {
            const [class_name, method_name] = url.split('/');
            const targetClass = handlers[class_name];

            if (!targetClass) {
                throw new Error(`Class "${class_name}" not found`);
            }
            if (typeof targetClass[method_name] !== 'function') {
                throw new Error(`Method "${method_name}" not found in class "${class_name}"`);
            }

            return targetClass[method_name](payload);
        } catch (error) {
            console.error(`EventDispatcher Error: ${error.message}`);
            return () => {}; // Trả về function rỗng nếu có lỗi
        }
    };

    return { register, dispatch };
};

const app_event = AppEvent();

const EventTrigger = (url, payload) => {
    return app_event.dispatch(url, payload);
}

export default EventTrigger;
