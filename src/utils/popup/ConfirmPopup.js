import popup from "./Popup";

const confirm = {
    show(message, callback) {
        popup.warning(message, true, callback)
    },
};

export default confirm;