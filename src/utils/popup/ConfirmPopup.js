import popup from "./Popup";

const confirm_popup = {
    showAlert(message, callback) {
        return popup.show({
            className: "confirm-popup",
            header: <div>Alert</div>,
            content: <div className="flex flex-col items-center gap-3">
                <img className="size-16" src="/alert.svg" alt=""/>
                <p  className="text-warning text-center">{message}</p>
            </div>,
            footer: <>
                <button className="btn btn-primary" onClick={() => {
                    popup.close();
                    callback(true);
                }}>Yes</button>
                <button className="btn btn-soft btn-secondary" onClick={() => {
                    popup.close();
                    callback(false);
                }}>No</button>
            </>,
        }, callback);
    },

    hide() {
        return popup.close();
    }
};

export default confirm_popup;