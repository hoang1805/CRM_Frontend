import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import '../../styles/components/elements/user.info.scss';
import { useNavigate } from 'react-router-dom';
import { Avatar, Dropdown } from 'antd';
import api from '../../utils/Axios';
import loading from '../../utils/Loading';
import flash from '../../utils/Flash';
import Client from '../../utils/client.manager';
import { UserOutlined } from '@ant-design/icons';

const UserInfo = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const menu = [
        {
            key: '1',
            label: <div onClick={() => navigate('/me')}>Thông tin cá nhân</div>,
        },
        {
            key: '2',
            label: (
                <div
                    onClick={() => {
                        (async () => {
                            try {
                                loading.show();
                                await api.post('/api/logout');
                                Client.clear();
                                logout();
                                flash.success('Đăng xuất thành công');
                                navigate('/login');
                            } catch (err) {
                                flash.error('Đăng xuất thất bại');
                                console.error(err);
                            } finally {
                                loading.hide();
                            }
                        })();
                    }}
                >
                    Đăng xuất
                </div>
            ),
        },
    ];
    return (
        <div className="user-info">
            <Dropdown arrow={false} placement={'bottomRight'} menu={{ items: menu }}>
                <Avatar size="large" icon={<UserOutlined />} />
            </Dropdown>
        </div>
    );
};

export default UserInfo;
