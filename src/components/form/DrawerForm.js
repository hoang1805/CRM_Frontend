import React, { useRef } from 'react';
import loading from '../../utils/Loading';
import popup from '../../utils/popup/Popup';
import error_popup from '../../utils/popup/ErrorPopup';
import api from '../../utils/Axios';
import drawer from '../../utils/Drawer';

const DrawerForm = (props) => {
    const child_refs = useRef({});
    let count = 0;
    const collectRefs = (children) => {
        return React.Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) return child; // Bỏ qua nếu không phải là React element
            if (typeof child.type === "object") {
                // Nếu là component (ví dụ: InputField), thêm ref
                return React.cloneElement(child, {
                    ref: (el) => { if (el) child_refs.current[count++] = el; }
                });
            } else if (child.props?.children) {
                // Nếu có children bên trong (ví dụ: <div> chứa InputField)
                return React.cloneElement(child, {
                    children: collectRefs(child.props.children)
                });
            }

            return child;
        });
    };

    const handleCancel = () => {
        for (const key in child_refs.current) {
            if (child_refs.current[key] && typeof child_refs.current[key].resetData === "function") {
                child_refs.current[key].resetData(); // Gọi hàm reset cho từng input
            }
        }

        drawer.close();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!props.url) {   
            return; 
        }
        loading.show();
        
        const data = {};
        for (const key in child_refs.current) {
            if (child_refs.current[key] && typeof child_refs.current[key].getData === 'function') 
                {
                let current_data = child_refs.current[key].getData();
                if (current_data?.key) {
                    data[current_data.key] = current_data?.value;
                }
            }
        }

        try {
            const response = await api.post(props.url, data);
            loading.hide();
            drawer.close();
            if (props.callback) {
                props.callback(response.data);
            }
            
        } catch (err) {
            loading.hide();
            error_popup.show(err.response.data.message || 'Đã có lỗi xảy ra');
        }
    }

    return (
        <div className={`drawer-form form drawer ${props.className || ''}`}>
            <div className="drawer-header">
                <h3 className="drawer-title">{props.title}</h3>
                <button type="button" className="btn btn-text btn-circle btn-sm absolute end-3 top-3" aria-label="Close"  onClick={handleCancel}>
                <span className="icon-[tabler--x] size-5"></span>
                </button>
            </div>
            <div className='form-body drawer-body justify-start flex gap-3 flex-col'>{collectRefs(props.children)}</div> 
            <div className="drawer-footer">
                <button type="button" className="btn btn-soft btn-secondary" onClick={handleCancel}>Thoát</button>
                <button className="btn btn-primary" onClick={handleSubmit}>{props.submit || 'Gửi'}</button>
            </div>
        </div>
    );
};

export default DrawerForm;