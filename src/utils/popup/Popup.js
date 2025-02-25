import { Modal } from 'antd';

// Singleton quản lý Popup
const popup = {

    error(content, closable = true) {
        Modal.error({
            title: 'Lỗi',
            content: content,
            closable: closable,
            centered: true,
        });
    },

    info(content, closable = true) {
        Modal.info({
            title: 'Thông báo',
            content: content,
            closable: closable,
            centered: true,
        });
    },

    warning(content, closable = true, callback = null) {
        Modal.warning({
            title: 'Cảnh báo',
            content: content,
            closable: closable,
            centered: true,
            onOk: () => {
                if (callback) {
                    callback(true);
                }
            }
        });
    },

};

export default popup;