import popup from "./Popup";

const confirm = {
    showAlert(message, callback) {
        popup.warning(message, true, callback)
    },
};

export default confirm;