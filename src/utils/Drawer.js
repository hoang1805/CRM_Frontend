import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const drawer_root =
    document.getElementById('drawer') ||
    (() => {
        const div = document.createElement('div');
        div.id = 'drawer';
        document.body.appendChild(div);
        return div;
    })();

// Component Drawer
const DrawerComponent = ({ isOpen, content, close }) => {
    return createPortal(
        <>
            <div className={`drawer-overlay overlay overlay-open:translate-x-0 drawer drawer-end ${!isOpen ? 'hidden' : 'open opened'}`} tabIndex={-1}>
                {isOpen && content}
            </div>
            {isOpen && <div onClick={() => {close()}} style={{'zIndex': 79}} className="overlay-backdrop transition duration fixed inset-0 bg-base-shadow/70 overflow-y-auto "></div>}
        </>
        ,
        drawer_root
    );
};

// Singleton quản lý Drawer
const drawer = {
    setDrawerState: null,

    // Hiển thị drawer
    show({content = "" }) {
        if (drawer.setDrawerState) {
            drawer.setDrawerState({ isOpen: true, content });
        }
    },

    // Ẩn drawer
    close() {
        if (drawer.setDrawerState) {
            drawer.setDrawerState({ isOpen: false, content: "" });
        }
    },

    // Hook sử dụng trong App
    useDrawer() {
        const [state, setState] = useState({ isOpen: false, content: "" });

        useEffect(() => {
            drawer.setDrawerState = setState;
            return () => { drawer.setDrawerState = null; };
        }, []);

        return <DrawerComponent {...state} close={drawer.close} />;
    }
};

export default drawer;