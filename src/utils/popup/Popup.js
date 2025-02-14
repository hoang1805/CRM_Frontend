import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const popup_root =
    document.getElementById('popup') ||
    (() => {
        const div = document.createElement('div');
        div.id = 'popup';
        document.body.appendChild(div);
        return div;
    })();

// Component Popup
const PopupComponent = ({ isOpen, className='', header='', content='', footer='', close }) => {
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                document.querySelector('#popup .modal')?.classList.add('open');
                document.querySelector('#popup .modal')?.classList.add('opened');
                document.querySelector('#popup .modal')?.classList.remove('hidden');
            }, 100); // Chờ 10ms để đảm bảo class được cập nhật
        } else {
            document.querySelector('#popup .modal')?.classList.remove('open');
            document.querySelector('#popup .modal')?.classList.remove('opened');
            document.querySelector('#popup .modal')?.classList.add('hidden');
        }
    }, [isOpen]);
    // ${isOpen ? 'open opened' : 'hidden'}

    return createPortal(
        <>
            <div className={`overlay modal modal-middle overlay-open:opacity-100 hidden`} style={{'zIndex': 1000}}>
                <div className={`modal-dialog overlay-open:opacity-100 popup-box`} onClick={(e) => e.stopPropagation()}>
                    <div className={`modal-content ${className}`}>
                    <div className="modal-header">
                        <h3 className="modal-title">{isOpen ? header : ''}</h3>
                        <button type="button" className="btn btn-text btn-circle btn-sm absolute end-3 top-3" aria-label="Close" onClick={close}>
                        <span className="icon-[tabler--x] size-4"></span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {isOpen ? content : ''}
                    </div>
                    <div className="modal-footer">
                        {isOpen ? footer : ''}
                    </div>
                    </div>
                </div>
            </div>
            {isOpen && <div style={{'zIndex': 999}} onClick={close} className="overlay-backdrop transition duration fixed inset-0 bg-base-shadow/70 overflow-y-auto "></div>}
        </>,
        popup_root
    );
};

// Singleton quản lý Popup
const popup = {
    setPopupState: null,

    // Hiển thị popup
    show({ className = "", header = "Thông báo", content = "", footer = "" }) {
        if (popup.setPopupState) {
            popup.setPopupState({ isOpen: true, className, header, content, footer });
        }
    },

    // Ẩn popup
    close() {
        if (popup.setPopupState) {
            popup.setPopupState({ isOpen: false, className: "", header: "", content: "", footer: '' });
        }
    },

    // Hook sử dụng trong App
    usePopup() {
        const [state, setState] = useState({ isOpen: false, className: "", header: "", content: "", footer: ""});

        useEffect(() => {
            popup.setPopupState = setState;
            return () => { popup.setPopupState = null; };
        }, []);

        return <PopupComponent {...state} close={popup.close} />;
    }
};

export default popup;