import { Button, Drawer, Space } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import loading from './Loading';
import api from './Axios';
import popup from './popup/Popup';

const drawer_root =
    document.getElementById('drawer') ||
    (() => {
        const div = document.createElement('div');
        div.id = 'drawer';
        document.body.appendChild(div);
        return div;
    })();

// Component Drawer
const DrawerComponent = ({ isOpen, close, ...props }) => {
    const child_refs = useRef({});

    // useEffect(() => {
    //     if (isOpen) {
    //         child_refs.current = {}; // Reset refs khi mở form mới
    //     }
    // }, [isOpen]);

    // const [update, setUpdate] = useState(0);
    // const forceUpdate = () => {
    //     setUpdate((prev) => prev + 1);
    // }

    // useEffect(() => {
    //     forceUpdate();
    // }, [props]);    

    let count = 0;
    const collectRefs = (children) => {
        return React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child;

            return React.cloneElement(child, {
                ref: (el) => {
                    if (el) {
                        console.log(
                            'Gán ref:',
                            child.type.name || child.props.name,
                            el
                        );
                        child_refs.current[count++] = el;
                    }
                },
                children: child.props?.children
                    ? collectRefs(child.props.children)
                    : child.props.children,
            });
        });
    };

    const handleCancel = () => {
        Object.values(child_refs.current).forEach((ref) => {
            if (ref?.resetData) ref.resetData();
            if (ref?.resetValues) ref.resetValues();
        });
        close();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!props.url) return;

        loading.show();
        // console.log(child_refs.current);
        // console.log(Object.keys(child_refs.current));
        let data = {};
        for (let key = 0; key < count; key++) {
            const current =
                child_refs.current[key] || child_refs.current[String(key)];
            if (!current) continue;
            if (typeof current.getData === 'function') {
                let current_data = current.getData();
                if (current_data?.key) {
                    data[current_data.key] = current_data?.value;
                }
            }

            if (typeof current.getValues === 'function') {
                let values = current.getValues();
                console.log(values);
                if (values && typeof values === 'object') {
                    Object.assign(data, values);
                }

                if (values && typeof values !== 'object') {
                    data = values;
                }
            }
        }

        // if (Object.keys(data).length === 0) {
        //     loading.hide();
        //     popup.error('Dữ liệu không hợp lệ');
        //     return;
        // }

        try {
            const response = await api.post(props.url, data);
            loading.hide();
            close();
            if (props.callback) {
                props.callback(response.data);
            }
        } catch (err) {
            loading.hide();
            popup.error(err.response?.data?.message || 'Đã có lỗi xảy ra');
        }
    };

    return createPortal(
        <Drawer
            title={props.title}
            className={props.className}
            width={props.width}
            style={props.style}
            onClose={props.form ? handleCancel : close}
            open={isOpen}
            extra={
                <div>
                    {props.form && (
                        <Space>
                            <Button onClick={handleSubmit} type="primary">
                                {props.submit || 'Gửi'}
                            </Button>

                            {/* <button
                            type="button"
                            className="btn btn-soft btn-secondary"
                            onClick={handleCancel}
                        >
                            Thoát
                        </button> */}
                        </Space>
                    )}
                    {props.notification && (
                        <Space>
                            <Button onClick={props.loadMore} disabled={!props.canLoad}>
                                Load more
                            </Button>
                            <Button onClick={props.markAll} type="primary" disabled={!props.canMark}>
                                Mark all as read
                            </Button>
                        </Space>
                    )}
                </div>
            }
        >
            {isOpen && props.form ? collectRefs(props.content) : props.content}
        </Drawer>,
        drawer_root
    );
};

// Singleton quản lý Drawer
const drawer = {
    setDrawerState: null,
    drawerState: null,

    show(props = {}) {
        if (drawer.setDrawerState) {
            drawer.setDrawerState({ isOpen: true, ...props });
        }
    },

    update(props = {}) {
        if (drawer.setDrawerState && drawer.drawerState?.isOpen) {
            drawer.setDrawerState({...drawer.drawerState, ...props});
        }
    },

    showForm(props = {}) {
        if (drawer.setDrawerState) {
            drawer.setDrawerState({ isOpen: true, form: true, ...props });
        }
    },

    close() {
        if (drawer.setDrawerState) {
            drawer.setDrawerState({ isOpen: false });
        }
    },

    useDrawer() {
        const [state, setState] = useState({ isOpen: false });

        useEffect(() => {
            drawer.setDrawerState = setState;
            drawer.drawerState = state;
            return () => {
                drawer.setDrawerState = null;
                drawer.drawerState = null;
            };
        }, [state]);

        return <DrawerComponent {...state} close={drawer.close} />;
    },
};

export default drawer;
