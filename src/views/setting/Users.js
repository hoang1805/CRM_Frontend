import { Button, ConfigProvider, Dropdown, Empty, Table } from 'antd';
import { createStyles } from 'antd-style';
import React, { useContext, useEffect, useState } from 'react';
import Gender from '../../utils/Gender';
import DateHelpers from '../../utils/Date';
import Role from '../../utils/Role';
import Arr from '../../utils/Array';
import confirm from '../../utils/popup/ConfirmPopup';
import api from '../../utils/Axios';
import flash from '../../utils/Flash';
import loading from '../../utils/Loading';
import { MoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Client from '../../utils/client.manager';
import Header from '../../components/page/Header';
import { RiSettings3Fill } from 'react-icons/ri';
import MainContent from '../../components/page/MainContent';
import AuthContext from '../../context/AuthContext';

const useStyle = createStyles(({ css, token }) => {
    const { antCls } = token;

    return {
        customTable: css`
            .${antCls || 'ant'}-table {
                .${antCls || 'ant'}-table-container {
                    .${antCls || 'ant'}-table-body,
                        .${antCls || 'ant'}-table-content {
                        scrollbar-width: thin;
                        scrollbar-color: #eaeaea transparent;
                        scrollbar-gutter: stable;
                    }
                }
            }
        `,
    };
});

const renderEmpty = (component_name) => {
    if (component_name === 'Table.filter') {
        return (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" />
        );
    }
};

const getActions = (user, navigate, current) => {
    const acl = user.acl;
    return {
        items: [
            {
                key: 'detail',
                label: <div>Chi tiết</div>,
                onClick: () => navigate(`/user/${user.id}`),
            },
            {
                key: 'edit',
                label: <div>Sửa</div>,
                disabled: !acl.edit,
                onClick: () => navigate(`/user/edit/${user.id}`),
            },
            {
                key: 'delete',
                label: <div>Xóa</div>,
                disabled: !acl.delete,
                danger: true,
                onClick: () =>
                    confirm.show(
                        'Are you sure you want to delete this user? This action can not be undone.',
                        (choose) => {
                            if (choose) {
                                const deleteUser = async () => {
                                    try {
                                        loading.show();
                                        const response = await api.delete(
                                            `/api/user/${user.id}`
                                        );
                                        flash.success(
                                            'Xóa người dùng thành công !!'
                                        );
                                        navigate(0);
                                    } catch (e) {
                                        flash.error(
                                            'Xóa người dùng thất bại!!'
                                        );
                                    } finally {
                                        loading.hide();
                                    }
                                };
                                deleteUser();
                            }
                        }
                    ),
            },
            {
                key: 'grant.manager',
                label: <div>Phân quyền quản lý</div>,
                disabled:
                    !acl.edit ||
                    user.role == Role.ADMIN ||
                    user.role == Role.MANAGER ||
                    user.id == current.id,
                onClick: async () => {
                    try {
                        loading.show();
                        await api.post(`/api/user/grant/manager/${user.id}`);
                        flash.success('Phân quyền quản lý thành công!!');
                        // navigate(`/settings/user/grant/manager/${user.id}`);
                        navigate(0);
                    } catch (e) {
                        flash.error('Phân quyền quản lý thất bại!!');
                    } finally {
                        loading.hide();
                    }
                },
            },
            {
                key: 'grant.staff',
                label: <div>Phân quyền nhân viên</div>,
                disabled:
                    !acl.edit ||
                    user.role == Role.ADMIN ||
                    user.role == Role.STAFF ||
                    user.id == current.id,
                onClick: async () => {
                    try {
                        loading.show();
                        await api.post(`/api/user/grant/staff/${user.id}`);
                        flash.success('Phân quyền nhân viên thành công!!');
                        navigate(0);
                    } catch (e) {
                        flash.error('Phân quyền nhân viên thất bại!!');
                    } finally {
                        loading.hide();
                    }
                },
            },
            {
                key: 'reset.password',
                label: <div>Reset mật khẩu</div>,
                disabled:
                    !acl.edit ||
                    user.role == Role.ADMIN ||
                    user.id == current.id,
                onClick: async () => {
                    try {
                        loading.show();
                        await api.post(`/api/user/reset.password/${user.id}`);
                        flash.success('Reset mật khẩu thành công!!');
                        navigate(0);
                    } catch (e) {
                        flash.error('Reset mật khẩu thất bại!!');
                    } finally {
                        loading.hide();
                    }
                },
            },
        ],
    };
};

const getColumns = (users, navigate, pagination, current) => {
    return [
        {
            title: '#',
            dataIndex: 'index',
            width: 50,
            render: (_, __, index) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            width: 150,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 200,
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            render: (e) => {
                return Gender.fromContext(e)?.label || 'Khác';
            },
            width: 100,
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthday',
            render: (e) => {
                return e ? DateHelpers.formatDate(e, 'DD-MM-YYYY') : '';
            },
            width: 150,
        },
        {
            title: 'Chức danh',
            dataIndex: 'title',
            render: (e) => {
                return e ? e : '';
            },
            width: 200,
        },
        {
            title: 'Quyền',
            dataIndex: 'role',
            render: (e) => {
                if (e == Role.ADMIN) {
                    return 'Người quản trị';
                }

                if (e == Role.MANAGER) {
                    return 'Người quản lý';
                }

                if (e == Role.STAFF) {
                    return 'Nhân viên';
                }

                return 'Không có dữ liệu';
            },
            width: 200,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            render: (e) => {
                return e
                    ? DateHelpers.formatDate(e, 'DD-MM-YYYY')
                    : '';
            },
            width: 150,
        },
        {
            title: 'Cập nhật lần cuối',
            dataIndex: 'last_update',
            render: (e) => {
                return e
                    ? DateHelpers.formatDate(e, 'DD-MM-YYYY')
                    : '';
            },
            width: 150,
        },
        {
            title: 'Người tạo',
            dataIndex: 'creator_id',
            render: (e) => {
                let user = Arr.findById(users, e);
                return user ? user.name : '';
            },
            width: 150,
        },
        {
            title: '',
            width: 30,
            fixed: 'right',
            render: (e) => {
                return (
                    <Dropdown
                        className="hover:cursor-pointer font-medium"
                        menu={getActions(e, navigate, current)}
                    >
                        <MoreOutlined />
                    </Dropdown>
                );
            },
        },
    ];
};

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { styles } = useStyle();
    const navigate = useNavigate();

    const [users_cache, setUsersCache] = useState(Client.get('users'));

    const auth = useContext(AuthContext);

    useEffect(() => {
        const unsubscribe = Client.subscribe(() => {
            setUsersCache(Client.get('users'));
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        async function loadUsers() {
            setLoading(true);
            try {
                const response = await api.get(`/api/user/list`, {
                    params: {
                        ipp: pageSize,
                        page: currentPage - 1,
                    }
                });
                const data = response.data || [];

                if (Array.isArray(data.content)) {
                    setUsers(data.content);
                } else {
                    setUsers([]);
                }
            } catch (error) {
                setUsers([]);
            } finally {
                setLoading(false);
            }
        }

        loadUsers();
    }, [pageSize, currentPage]);

    return (
        <div className="users-page">
            <Header
                icon={<RiSettings3Fill className="icon" />}
                title={'Cấu hình hệ thống'}
                subtitle={'Quản lý người dùng'}
            />
            <MainContent className="users">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="text-lg font-semibold">
                                Quản lý người dùng
                            </div>
                        </div>
                        <Button
                            type="primary"
                            onClick={() => {
                                navigate('/user/create');
                            }}
                        >
                            Thêm mới
                        </Button>
                    </div>
                    <ConfigProvider renderEmpty={renderEmpty}>
                        <Table
                            className={styles.customTable}
                            columns={getColumns(
                                users_cache,
                                navigate,
                                {
                                    current: currentPage,
                                    pageSize: pageSize,
                                },
                                auth.user
                            )}
                            rowKey={(e) => e.id}
                            bordered
                            dataSource={users}
                            pagination={{
                                showSizeChanger: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} items`,
                                pageSizeOptions: [10, 20, 50, 100, 500],
                                current: currentPage,
                                pageSize: pageSize,
                                onChange: (page, pageSize) => {
                                    setCurrentPage(page);
                                    setPageSize(pageSize);
                                },
                            }}
                            loading={loading}
                            locale={{
                                emptyText: (
                                    <Empty description="No Data"></Empty>
                                ),
                            }}
                            scroll={{
                                x: 'max-content',
                                y: 490,
                            }}
                        />
                    </ConfigProvider>
                </div>
            </MainContent>
        </div>
    );
};

export default Users;
