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
import popup from '../../utils/popup/Popup';
import drawer from '../../utils/Drawer';
import SystemDrawerForm from '../../components/system/SystemDrawerForm';

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

const getActions = (system, navigate, current) => {
    const acl = system.acl;
    return {
        items: [
            {
                key: 'edit',
                label: <div>Sửa</div>,
                disabled: !acl.edit,
                onClick: () => {
                    drawer.showForm({
                        title: 'Sửa thông tin hệ thống',
                        url: `api/system/edit/${system.id}`,
                        callback: () => {
                            flash.success('Cập nhật thành công!');
                            navigate(0);
                        },
                        width: 500,
                        submit: 'Cập nhật',
                        content: (
                            <SystemDrawerForm
                                value={system}
                                submit="Cập nhật"
                            />
                        ),
                    });
                },
            },
            {
                key: 'delete',
                label: <div>Xóa</div>,
                disabled: !acl.delete,
                danger: true,
                onClick: () =>
                    confirm.show(
                        'Are you sure you want to delete this system? This action can not be undone.',
                        (choose) => {
                            if (choose) {
                                const deleteSystem = async () => {
                                    try {
                                        loading.show();
                                        const response = await api.delete(
                                            `/api/system/delete/${system.id}`
                                        );
                                        flash.success(
                                            'Xóa hệ thống thành công !!'
                                        );
                                        navigate(0);
                                    } catch (e) {
                                        // flash.error(
                                        //     'Xóa người dùng thất bại!!'
                                        // );
                                        popup.error(
                                            e?.response?.data.message ||
                                                e?.message ||
                                                'Đã có lỗi xảy ra'
                                        );
                                    } finally {
                                        loading.hide();
                                    }
                                };
                                deleteSystem();
                            }
                        }
                    ),
            },
        ],
    };
};

const getColumns = (systems, navigate, pagination, current) => {
    return [
        {
            title: '#',
            dataIndex: 'index',
            width: 50,
            render: (_, __, index) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: 'Tên hệ thống',
            dataIndex: 'name',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Giới hạn số người dùng',
            dataIndex: 'max_user',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            render: (e) => {
                return e ? DateHelpers.formatDate(e, 'DD-MM-YYYY') : '';
            },
            width: 150,
        },
        {
            title: 'Cập nhật lần cuối',
            dataIndex: 'last_update',
            render: (e) => {
                return e ? DateHelpers.formatDate(e, 'DD-MM-YYYY') : '';
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

const Systems = () => {
    const [systems, setSystems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { styles } = useStyle();
    const navigate = useNavigate();

    const [systems_cache, setSystemsCache] = useState(Client.get('systems'));

    const auth = useContext(AuthContext);

    useEffect(() => {
        const unsubscribe = Client.subscribe(() => {
            setSystemsCache(Client.get('systems'));
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        async function loadSystems() {
            setLoading(true);
            try {
                const response = await api.get(`/api/system/list`, {
                    params: {
                        ipp: pageSize,
                        page: currentPage - 1,
                    },
                });
                const data = response.data || [];

                if (Array.isArray(data.content)) {
                    setSystems(data.content);
                } else {
                    setSystems([]);
                }
            } catch (error) {
                setSystems([]);
            } finally {
                setLoading(false);
            }
        }

        loadSystems();
    }, [pageSize, currentPage]);

    return (
        <div className="systems-page">
            <Header
                icon={<RiSettings3Fill className="icon" />}
                title={'Cấu hình hệ thống'}
                subtitle={'Quản lý người dùng'}
            />
            <MainContent className="systems">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="text-lg font-semibold">
                                Quản lý hệ thống
                            </div>
                        </div>
                        <Button
                            type="primary"
                            onClick={() => {
                                drawer.showForm({
                                    title: 'Thêm hệ thống',
                                    url: `api/system/create`,
                                    callback: () => {
                                        flash.success('Thêm mới thành công!');
                                        navigate(0);
                                    },
                                    width: 500,
                                    submit: 'Thêm',
                                    content: (
                                        <SystemDrawerForm
                                        />
                                    ),
                                });
                            }}
                        >
                            Thêm mới
                        </Button>
                    </div>
                    <ConfigProvider renderEmpty={renderEmpty}>
                        <Table
                            className={styles.customTable}
                            columns={getColumns(
                                systems_cache,
                                navigate,
                                {
                                    current: currentPage,
                                    pageSize: pageSize,
                                },
                                auth.system
                            )}
                            rowKey={(e) => e.id}
                            bordered
                            dataSource={systems}
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

export default Systems;
