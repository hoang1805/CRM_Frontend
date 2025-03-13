import React, { useContext, useEffect, useState } from 'react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import AuthContext from '../../context/AuthContext';
import Client from '../../utils/client.manager';
import { Client as StompClient } from '@stomp/stompjs';
import Arr from '../../utils/Array';
import api from '../../utils/Axios';
import { Avatar, Badge, Button, Divider, List, notification, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import drawer from '../../utils/Drawer';
import loading from '../../utils/Loading';
import flash from '../../utils/Flash';
import { useNavigate } from 'react-router-dom';

function getContent(item, users) {
    const parseMessage = (message, data) => {
        const parts = message.split(/(\$\{[^}]+\})/g); // Tách thành mảng
        return parts.map((part, index) => {
            const match = part.match(/\$\{([^}]+)\}/);
            if (match) {
                const key = match[1];
                return key in data ? <b key={index}>{data[key]}</b> : part;
            }
            return part;
        });
    };

    const message = item?.message || '';
    const user = Arr.findById(users, item.source_id);
    const data = item?.additional || {};

    if (user) {
        data.user = user.name;
    }

    return (
        <div className="notification-message">
            {parseMessage(message, data)}
        </div>
    );
}

function getAvatar(item) {
    if (item.source_id) {
        return <Avatar icon={<UserOutlined />} />;
    }

    return (
        <Avatar
            icon={<InfoCircleOutlined />}
            style={{
                backgroundColor: '#1677ff',
            }}
        />
    );
}

const Notification = (props) => {
    const auth = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);
    const [users, setUsers] = useState(Client.get('users'));
    const [total, setTotal] = useState(0);

    const [page, setPage] = useState(0);
    const [ipp, setIpp] = useState(10);
    const [load, setLoad] = useState(false);

    const [init, setInit] = useState(true);


    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = Client.subscribe(() => {
            setUsers(Client.get('users'));
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (unread < 0) {
            setUnread(0);
        }
    }, [unread]);

    useEffect(() => {
        const countUnread = async () => {
            try {
                const response = await api.get(
                    `/api/notification/count/unread`
                );
                const data = response.data;
                if (data && data.count) {
                    setUnread(data.count);
                }
            } catch (error) {
                console.log(error);
            }
        };

        countUnread();
    }, []);

    useEffect(() => {
        const newClient = new StompClient({
            brokerURL: 'wss://titancrm.vn/ws/websocket',
            onConnect: () => {
                console.log('Connected to WebSocket');
                newClient.subscribe(
                    `/topic/notification/${auth.user.id}`,
                    (message) => {
                        try {
                            let body = JSON.parse(message.body);
                            if (!body || typeof body !== 'object') return;

                            setNotifications((prevNotifications) => {
                                const safeNotifications = Array.isArray(
                                    prevNotifications
                                )
                                    ? prevNotifications
                                    : [];
                                let new_notifications = [
                                    body,
                                    ...safeNotifications,
                                ];

                                return Arr.sort(
                                    Arr.uniqueById(new_notifications),
                                    (e) => e.id,
                                    'desc'
                                );
                            });

                            notification.open({
                                message: <b>{body.title}</b>,
                                description: getContent(body, users),
                                icon: getAvatar(body),
                                stack: 3,
                                duration: 3
                            })

                            setUnread((prev) => prev + 1);
                            setTotal((prev) => prev + 1);
                        } catch (error) {
                            console.error('Invalid notification data:', error);
                        }
                    }
                );
            },
            onDisconnect: () => console.log('Disconnected from WebSocket'),
            onStompError: (error) => console.error('STOMP Error:', error),
            onWebSocketError: (error) =>
                console.error('WebSocket Error:', error),
        });

        newClient.activate();

        return () => {
            newClient.deactivate();
        };
    }, [auth.user.id]); // Đảm bảo reset WebSocket khi user thay đổi

    useEffect(() => {
        loadMore();
        setInit(false);
    }, []);

    const loadMore = () => {
        if (load) return;

        (async () => {
            try {
                loading.show();
                setLoad(true);
                console.log('Loading more notifications...');

                const response = await api.get(`/api/notification/list`, {
                    params: { page, ipp },
                });

                const data = response.data || {};
                const newNotifications = data.content || [];
                console.log(data);
                if (newNotifications.length) {
                    setNotifications(
                        Arr.sort(
                            Arr.uniqueById([
                                ...notifications,
                                ...newNotifications,
                            ]),
                            (e) => e.id,
                            'desc'
                        )
                    );

                    // console.log(notifications);

                    if (newNotifications.length == ipp) {
                        setPage((prev) => prev + 1);
                    }
                }

                setTotal(data.totalElements || notifications.length);
                setLoad(false);
                if (!init) {
                    flash.success('Load notifications successfully');
                }
            } catch (error) {
                console.error('Error load notifications:', error);
                setLoad(false);
                if (!init) {
                    flash.error('Load notifications failed');
                }
            } finally {
                loading.hide();
            }
        })();
    };

    const markRead = async (item) => {
        try {
            if (item.is_read) {
                return true;
            }

            loading.show();
            const response = await api.post(
                `/api/notification/mark.read/${item.id}`
            );
            const data = response.data;
            if (data?.notification) {
                setNotifications(
                    Arr.update(notifications, data.notification, (e) => e.id)
                );
            }
            setUnread((prev) => prev - 1);
            flash.success('Mark notification as read successfully');
            loading.hide();
            return true;
        } catch (e) {
            console.error('Error marking notification as read:', e);
            flash.error('Mark notification as read failed');
            loading.hide();
            return false;
        }
    };

    const markAllRead = async() => {
        try {
            if (!unread) {
                return ;
            }
            loading.show();
            await api.post(`/api/notification/mark.all`);
            setNotifications(Arr.updateAll(notifications, (e) => {
                return {
                    ...e,
                    is_read: true,
                }
            }));
            setUnread(0);
            flash.success('Mark all notifications as read successfully');
            drawer.close();
        } catch (e) {
            console.error('Error marking all notifications as read:', e);
            flash.error('Mark all notifications as read failed');
        } finally {
            loading.hide();
        }
    }

    const handleClick = async(item) => {
        if (!await markRead(item)) {
            return ;
        }
        if (item.url) {
            navigate(item.url);
        }
        drawer.close();
    }
    const drawer_props = {
        title: 'Notifications',
        content: (
            <List
                dataSource={notifications}
                renderItem={(item) => (
                    <List.Item
                        className='hover:cursor-pointer hover:bg-gray-100 transition-all duration-200'
                        key={item.id}
                        actions={[
                            <Button
                                color="primary"
                                variant="link"
                                disabled={item.is_read}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    markRead(item);
                                }}
                            >
                                Mask as read
                            </Button>,
                        ]}
                        onClick={() => {handleClick(item)}}
                    >
                        <List.Item.Meta
                            className='pl-3'
                            avatar={getAvatar(item)}
                            title={<div className={`${item.is_read ? 'font-normal' : 'font-bold'}`}>{item.title}</div>}
                            description={getContent(item, users)}
                        />
                    </List.Item>
                )}
            />
        ),
        width: 600,
        notification: true,
        loadMore: loadMore,
        canLoad: notifications.length < total,
        canMark: unread != 0,
        markAll: markAllRead
    };

    useEffect(() => {
        drawer.update(drawer_props);
    }, [notifications, total, users, unread]);

    return (
        <div className={`notification ${props.className || ''}`}>
            <Badge count={unread} overflowCount={999}>
                <IoIosNotificationsOutline
                    className="text-[25px]"
                    onClick={() => {
                        drawer.show(drawer_props);
                    }}
                />
            </Badge>
        </div>
    );
};

export default Notification;
