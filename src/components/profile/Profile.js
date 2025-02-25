import React from 'react';
import ProfileHeader from './ProfileHeader';
import '../../styles/components/profile/profile.scss';
import ProfileDetails from './ProfileDetails';
import { Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import drawer from '../../utils/Drawer';
import flash from '../../utils/Flash';
import UPDrawerForm from '../user/UPDrawerForm';

const Profile = (props) => {
    const acl = props?.user?.acl;
    const edit = acl?.edit ? true : false;
    const navigate = useNavigate();
    return (
        <div className={`user-profile relative ${props.className || ''}`}>
            <ProfileHeader user={props?.user} />
            <ProfileDetails user={props?.user} />
            {edit && (
                <div className="actions absolute top-0 right-0 pt-3 pr-3">
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    label: 'Sửa thông tin',
                                    key: 'edit',
                                    disabled: !edit,
                                    onClick: () => {
                                        navigate(`/user/edit/${props?.user?.id}`);
                                    },
                                },
                                {
                                    label: 'Đổi mật khẩu',
                                    key: 'change-password',
                                    disabled:!edit,
                                    onClick: () => {
                                        drawer.showForm({
                                            title: 'Đổi mật khẩu',
                                            url: `/api/user/edit.password/${props?.user?.id}`,
                                            callback: () => {
                                                flash.success('Đổi mật khẩu thành công!');
                                                window.location.reload();
                                            },
                                            submit: 'Thay đổi',
                                            content: <UPDrawerForm />
                                        })
                                    }
                                }
                            ],
                        }}
                    >
                        <a
                            style={{
                                color: '#1677ff',
                                textDecoration: 'none',
                                backgroundColor: 'transparent',
                                outline: 'none',
                                cursor: 'pointer',
                                transition:
                                    'color 0.3s',
                            }}
                            onClick={(e) => e.preventDefault()}
                        >
                            <Space>
                                Hành động
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            )}
        </div>
    );
};

export default Profile;
