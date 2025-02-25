import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// Đảm bảo thẻ div#loading tồn tại trong DOM
const loading_root =
    document.getElementById('loading') ||
    (() => {
        const div = document.createElement('div');
        div.id = 'loading';
        document.body.appendChild(div);
        return div;
    })();

// Component Loading hiển thị khi `isLoading === true`
const LoadingComponent = ({ isLoading }) => {
    if (!isLoading) return null;
    return createPortal(
        <Spin
            fullscreen
            indicator={
                <LoadingOutlined
                    style={{
                        fontSize: 48,
                    }}
                    spin
                />
            }
            className='z-[100000]'
        />,
        loading_root
    );
};

// Singleton quản lý Loading
const loading = {
    setLoadingState: null,

    // Hiển thị loading
    show() {
        if (loading.setLoadingState) {
            loading.setLoadingState(true);
        }
    },

    // Ẩn loading
    hide() {
        if (loading.setLoadingState) {
            setTimeout(() => loading.setLoadingState(false), 200);
        }
    },

    // Hook sử dụng trong App
    useLoading() {
        const [isLoading, setState] = useState(false);
        useEffect(() => {
            loading.setLoadingState = setState;
            return () => {
                loading.setLoadingState = null;
            };
        }, []);
        return <LoadingComponent isLoading={isLoading} />;
    },
};

export default loading;
