import popup from "../popup/Popup";

const Response = {
    error: {
        get(err, default_message) {
            return err?.response?.data?.message || err?.message || default_message || 'Đã có lỗi xảy ra';
        },

        show(err, default_message) {
            popup.error(this.get(err, default_message));
        },
    },
    
    data: {
        get(response) {
            return response?.data;
        }
    }
}

export default Response;