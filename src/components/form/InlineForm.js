import React, { useRef } from 'react';
import loading from '../../utils/Loading';
import popup from '../../utils/popup/Popup';
import api from '../../utils/Axios';
import { useNavigate } from 'react-router-dom';
import confirm from '../../utils/popup/ConfirmPopup';
import { Button } from 'antd';

const InlineForm = (props) => {
    const child_refs = useRef({});
    const navigate = useNavigate();
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
        confirm.show('Are you sure to cancel this page? The data may not be changed.', (choose) => {
            if (choose) {
                navigate(-1);
            }
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!props.url) {   
            return; 
        }
        loading.show();
        
        let data = {};
        if (props.extras_data) {
            data = {...props.extras_data, ...data };
        }
        
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
            if (props.callback) {
                props.callback(response.data);
            }
        } catch (err) {
            popup.error(err.response.data.message || 'Đã có lỗi xảy ra');
        } finally {
            loading.hide();
        }
    }

    return (
        <div className={`inline-form form ${props.className || ''}`}>
            {props.title ? <div className='form-title'>{props.title}</div> : ""}
            <div className='form-body'>{collectRefs(props.children)}</div> 
            <div className='pt-6 actions flex flex-row gap-6 items-center justify-between'>
                <Button className="form-action form-btn-submit flex-1" type='primary' onClick={handleSubmit}>{props.submit || 'Gửi'}</Button>
                {props.cancel && <Button className="form-action form-btn-cancel flex-1 btn btn-soft btn-secondary" color='default' variant='filled' onClick={handleCancel}>Thoát</Button>}
            </div>
        </div>
    );
};

export default InlineForm;