import React, { useEffect, useState } from 'react';
import Header from '../../components/page/Header';
import { RiSettings3Fill } from 'react-icons/ri';
import MainContent from '../../components/page/MainContent';
import api from '../../utils/Axios';
import drawer from '../../utils/Drawer';
import SourceDrawerForm from '../../components/sources/SourceDrawerForm';
import '../../styles/views/setting/sources.scss';
import { useNavigate } from 'react-router-dom';
import flash from '../../utils/Flash';
import confirm from '../../utils/popup/ConfirmPopup';
import loading from '../../utils/Loading';
import popup from '../../utils/popup/Popup';
import { Button, ConfigProvider, Dropdown, Empty, Input, Table } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';

const getColumns = (sources, navigate, pagination) => {
    return [
        {
            title: '#',
            dataIndex: 'index',
            width: 50,
            render: (_, __, index) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: 'Tên nguồn khách hàng',
            dataIndex: 'name',
        },
        {
            title: 'Mã',
            dataIndex: 'code',
        },
        {
            title: 'Nguồn khách hàng cha',
            width: 200,
            render: (e) => {
                if (!e.parent_id) return '';
                const parent = sources.find((elem) => elem.id === e.parent_id);
                return parent ? parent.name : ''; // Lấy 'name' hoặc trả về rỗng nếu không tìm thấy
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
                                            title: 'Cập nhật nguồn khách hàng',
                                            url: `/api/source/edit/${e.id}`,
                                            callback: () => {
                                                flash.success(
                                                    'Cập nhật thành công!'
                                                );
                                                navigate(0);
                                            },
                                            width: 500,
                                            submit: 'Cập nhật',
                                            content: (
                                                <SourceDrawerForm
                                                    value={e}
                                                    sources={sources}
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
                                            'Are you sure you want to delete this source? This action can not be undone.',
                                            (choose) => {
                                                if (choose) {
                                                    const deleteSource =
                                                        async () => {
                                                            try {
                                                                loading.show();
                                                                const response =
                                                                    await api.delete(
                                                                        `/api/source/delete/${e.id}`
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
                                                    deleteSource();
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

const Sources = () => {
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { styles } = useStyle();
    const navigate = useNavigate();
    useEffect(() => {
        async function loadSources() {
            setLoading(true);
            try {
                const response = await api.get('/api/source/list');
                const data = response.data || [];

                if (Array.isArray(data)) {
                    setSources(data);
                } else {
                    setSources([]);
                }
            } catch (error) {
                setSources([]);
            } finally {
                setLoading(false);
            }
        }

        loadSources();
    }, []);

    const loadSources = async (input) => {
        if (loading) {
            return;
        }

        setLoading(true);
        try {
            const response = await api.get(`/api/source/search?query=${input}`);
            const data = response.data || [];
            if (Array.isArray(data)) {
                setSources(data);
            } else {
                setSources([]);
            }
        } catch (error) {
            setSources([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sources-page">
            <Header
                icon={<RiSettings3Fill className="icon" />}
                title={'Cấu hình hệ thống'}
                subtitle={'Quản lý nguồn khách hàng'}
            />
            <MainContent className="sources">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="text-lg font-semibold">
                                Quản lý nguồn khách hàng
                            </div>
                            <Input.Search
                                placeholder="Tìm kiếm nguồn khách hàng"
                                className="input w-full max-w-xs"
                                onSearch={loadSources}
                                allowClear
                            />
                        </div>
                        <Button
                            className=""
                            type="primary"
                            onClick={() =>
                                drawer.showForm({
                                    title: 'Thêm nguồn khách hàng',
                                    url: '/api/source/create',
                                    callback: () => {
                                        flash.success(
                                            'Thêm nguồn khách hàng thành công!'
                                        );
                                        navigate(0);
                                    },
                                    submit: 'Thêm mới',
                                    content: (
                                        <SourceDrawerForm sources={sources} />
                                    ),
                                })
                            }
                        >
                            Thêm mới
                        </Button>
                    </div>
                    <ConfigProvider renderEmpty={renderEmpty}>
                        <Table
                            className={styles.customTable}
                            columns={getColumns(sources, navigate, {
                                current: currentPage,
                                pageSize: pageSize,
                            })}
                            rowKey={(e) => e.id}
                            bordered
                            dataSource={sources}
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

export default Sources;
