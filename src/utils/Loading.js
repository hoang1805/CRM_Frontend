import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';

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
        <div className="loading-overlay" style={{'zIndex': 1000}}>
            <div className="loading-spinner"></div>
        </div>,
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
