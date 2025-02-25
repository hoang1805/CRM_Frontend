import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/page/Header';
import { RiSettings3Fill } from 'react-icons/ri';
import MainContent from '../../components/page/MainContent';
import api from '../../utils/Axios';
import drawer from '../../utils/Drawer';
import '../../styles/views/setting/relationships.scss';
import { useNavigate } from 'react-router-dom';
import flash from '../../utils/Flash';
import confirm from '../../utils/popup/ConfirmPopup';
import loading from '../../utils/Loading';
import RelationshipDrawerForm from '../../components/relationships/RelationshipDrawerForm';
import InputColorPicker from '../../components/form/inputs/InputColorPicker';
import DateHelpers from '../../utils/Date';
import Client from '../../utils/client.manager';
import popup from '../../utils/popup/Popup';
import { MoreOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Dropdown, Empty, Table } from 'antd';
import { createStyles } from 'antd-style';

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

const getColumns = (relationships, navigate, users = [], pagination) => {
    return [
        {
            title: '#',
            dataIndex: 'index',
            width: 50,
            render: (_, __, index) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: 'Tên mối quan hệ',
            render: (e) => {
                return e.name;
            },
        },
        {
            title: 'Màu mối quan hệ',
            render: (e) => {
                return (
                    <InputColorPicker
                        value={e.color}
                        callback={async (color) => {
                            try {
                                const response = await api.post(
                                    `/api/relationship/edit.color/${e.id}`,
                                    { color: color }
                                );
                                flash.success('Cập nhật màu thành công!');
                                return true;
                            } catch (err) {
                                flash.error('Cập nhật màu thất bại!');
                                return false;
                            }
                        }}
                    />
                );
            },
        },
        {
            title: 'Mô tả',
            render: (e) => {
                return e.description;
            },
            width: 250,
        },
        {
            title: 'Người tạo / Ngày tạo',
            width: 200,
            render: (e) => {
                const user = users.find(
                    (u) => u.id === e.creatorId || u.id === e.creator_id
                );
                return (
                    <div>
                        <div>{user?.name || 'Không có dữ liệu'}</div>
                        <div className="text-sm text-gray-500">
                            {DateHelpers.formatDate(
                                e.createdAt,
                                'DD/MM/YYYY HH:mm'
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            title: '',
            width: 30,
            render: (e) => {
                const acl = e.acl;
                return (
                    <Dropdown
                        className="hover:cursor-pointer font-medium"
                        menu={{
                            items: [
                                {
                                    key: 'edit',
                                    label: <div>Sửa</div>,
                                    onClick: () => {
                                        drawer.showForm({
                                            title: 'Cập nhật mối quan hệ',
                                            url: `/api/relationship/edit/${e.id}`,
                                            callback: () => {
                                                flash.success(
                                                    'Cập nhật thành công!'
                                                );
                                                navigate(0);
                                            },
                                            width: 500,
                                            submit: 'Cập nhật',
                                            content: (
                                                <RelationshipDrawerForm
                                                    value={e}
                                                    submit="Cập nhật"
                                                />
                                            ),
                                        });
                                    },
                                    disabled: !(acl?.edit || acl?.edit == null),
                                },
                                {
                                    key: 'delete',
                                    label: <div>Xóa</div>,
                                    disabled: !(
                                        acl?.delete || acl?.delete == null
                                    ),
                                    danger: true,
                                    onClick: () => {
                                        confirm.show(
                                            'Are you sure you want to delete this relationship? This action can not be undone.',
                                            (choose) => {
                                                if (choose) {
                                                    const deleteRelationship =
                                                        async () => {
                                                            try {
                                                                loading.show();
                                                                const response =
                                                                    await api.delete(
                                                                        `/api/relationship/delete/${e.id}`
                                                                    );
                                                                flash.success(
                                                                    'Xóa thành công!'
                                                                );
                                                                navigate(0);
                                                            } catch (err) {
                                                                popup.error(
                                                                    'Xóa thất bại!'
                                                                );
                                                                console.error(
                                                                    err
                                                                );
                                                            } finally {
                                                                loading.hide();
                                                            }
                                                        };
                                                    deleteRelationship();
                                                }
                                            }
                                        );
                                    },
                                },
                            ],
                        }}
                    >
                        <MoreOutlined />
                    </Dropdown>
                );
            },
        },
    ];
};

const Relationships = () => {
    const formRef = useRef({});
    const [relationships, setRelationships] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { styles } = useStyle();
    const navigate = useNavigate();
    const [users, setUsers] = useState(Client.get('users'));

    useEffect(() => {
        const unsubscribe = Client.subscribe(() => {
            setUsers(Client.get('users'));
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        async function loadRelationships() {
            setLoading(true);
            try {
                const response = await api.get('/api/relationship/list');
                const data = response.data || [];

                if (Array.isArray(data)) {
                    setRelationships(data);
                } else {
                    setRelationships([]);
                }
            } catch (error) {
                setRelationships([]);
            } finally {
                setLoading(false);
            }
        }

        loadRelationships();
    }, []);

    return (
        <div className="relationships-page">
            <Header
                icon={<RiSettings3Fill className="icon" />}
                title={'Cấu hình hệ thống'}
                subtitle={'Quản lý mối quan hệ'}
            />
            <MainContent className="relationships">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="text-lg font-semibold">
                                Quản lý mối quan hệ
                            </div>
                        </div>
                        <Button
                            type="primary"
                            onClick={() => {
                                drawer.showForm({
                                    title: 'Thêm mối quan hệ',
                                    url: `/api/relationship/create`,
                                    callback: () => {
                                        flash.success('Thêm thành công!');
                                        navigate(0);
                                    },
                                    width: 500,
                                    submit: 'Thêm',
                                    content: <RelationshipDrawerForm />,
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
                                relationships,
                                navigate,
                                users,
                                {
                                    current: currentPage,
                                    pageSize: pageSize,
                                }
                            )}
                            rowKey={(e) => e.id}
                            bordered
                            dataSource={relationships}
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

export default Relationships;
