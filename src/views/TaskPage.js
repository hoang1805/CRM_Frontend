import React, { useContext, useEffect, useState } from 'react';
import { CgWorkAlt } from 'react-icons/cg';
import Header from '../components/page/Header';
import MainContent from '../components/page/MainContent';
import { Button, ConfigProvider, Dropdown, Empty, Input, Select, Table } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import TaskStatus from './account/TaskStatus';
import DateHelpers from '../utils/Date';
import loading from '../utils/Loading';
import flash from '../utils/Flash';
import api from '../utils/Axios';
import confirm_popup from '../utils/popup/ConfirmPopup';
import TaskDrawerForm from '../components/task/TaskDrawerForm';
import drawer from '../utils/Drawer';
import Client from '../utils/client.manager';
import { createStyles } from 'antd-style';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Arr from '../utils/Array';
const renderEmpty = (component_name) => {
    if (component_name === 'Table.filter') {
        return (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" />
        );
    }
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

const getActions = (task, user) => {
    const acl = task.acl;
    const canEdit = !!task?.acl?.edit;
    const canDelete = !!task?.acl?.delete;
    let items = [];
    let set_start = null;
    if (acl.edit && task.status == TaskStatus.DRAFT) {
        set_start = {
            label: (
                <div
                    onClick={async () => {
                        try {
                            loading.show();
                            await api.post(`/api/task/start/${task.id}`);
                            flash.success('Thay đổi trạng thái thành công');
                            window.location.reload();
                        } catch (e) {
                            console.error(e);
                            flash.error('Thay đổi trạng thái thất bại');
                        } finally {
                            loading.hide();
                        }
                    }}
                >
                    Bắt đầu công việc
                </div>
            ),
        };
    }

    let request_approval = null;
    if (acl.edit && task.status == TaskStatus.IN_PROGRESS) {
        request_approval = {
            label: (
                <div
                    onClick={async () => {
                        try {
                            loading.show();
                            await api.post(
                                `/api/task/request.approval/${task.id}`
                            );
                            flash.success('Thay đổi trạng thái thành công');
                            window.location.reload();
                        } catch (e) {
                            console.error(e);
                            flash.error('Thay đổi trạng thái thất bại');
                        } finally {
                            loading.hide();
                        }
                    }}
                >
                    Yêu cầu duyệt
                </div>
            ),
        };
    }

    let approve = null;
    if (acl.review && task.status == TaskStatus.PENDING_APPROVAL) {
        approve = {
            label: (
                <div
                    onClick={async () => {
                        try {
                            loading.show();
                            await api.post(`/api/task/approve/${task.id}`);
                            flash.success('Thay đổi trạng thái thành công');
                            window.location.reload();
                        } catch (e) {
                            console.error(e);
                            flash.error('Thay đổi trạng thái thất bại');
                        } finally {
                            loading.hide();
                        }
                    }}
                >
                    Chấp nhận
                </div>
            ),
        };
    }

    let reject = null;
    if (acl.review && task.status == TaskStatus.PENDING_APPROVAL) {
        reject = {
            label: (
                <div
                    onClick={async () => {
                        try {
                            loading.show();
                            await api.post(`/api/task/reject/${task.id}`);
                            flash.success('Thay đổi trạng thái thành công');
                            window.location.reload();
                        } catch (e) {
                            console.error(e);
                            flash.error('Thay đổi trạng thái thất bại');
                        } finally {
                            loading.hide();
                        }
                    }}
                >
                    Từ chối
                </div>
            ),
        };
    }

    let complete = null;
    if (acl.review && task.status == TaskStatus.APPROVED) {
        complete = {
            label: (
                <div
                    onClick={async () => {
                        try {
                            loading.show();
                            await api.post(`/api/task/complete/${task.id}`);
                            flash.success('Thay đổi trạng thái thành công');
                            window.location.reload();
                        } catch (e) {
                            console.error(e);
                            flash.error('Thay đổi trạng thái thất bại');
                        } finally {
                            loading.hide();
                        }
                    }}
                >
                    Hoàn thành
                </div>
            ),
            key: '2',
            disabled: task.status != TaskStatus.COMPLETED,
        };
    }

    let cancel = null;
    if (user.id == task.manager_id || user.id == task.creator_id) {
        cancel = {
            label: (
                <div
                    onClick={async () => {
                        try {
                            loading.show();
                            await api.post(`/api/task/cancel/${task.id}`);
                            flash.success('Thay đổi trạng thái thành công');
                            window.location.reload();
                        } catch (e) {
                            console.error(e);
                            flash.error('Thay đổi trạng thái thất bại');
                        } finally {
                            loading.hide();
                        }
                    }}
                >
                    Hủy
                </div>
            ),
            disabled: task.status == TaskStatus.CANCELLED
        };
    }

    return {
        items: [
            {
                label: (
                    <div
                        onClick={() => {
                            drawer.showForm({
                                title: 'Cập nhật công việc',
                                url: `/api/task/edit/${task.id}`,
                                callback: () => {
                                    flash.success('Cập nhật thành công!');
                                    window.location.reload();
                                },
                                width: 718,
                                submit: 'Cập nhật',
                                content: <TaskDrawerForm value={task} />,
                            });
                        }}
                    >
                        Sửa
                    </div>
                ),
                key: '1',
                disabled:
                    !canEdit ||
                    (task.status != TaskStatus.DRAFT &&
                        task.status != TaskStatus.IN_PROGRESS),
            },
            {
                label: (
                    <div
                        onClick={async () => {
                            try {
                                loading.show();
                                const response = await api.post(
                                    `/api/task/duplicate/${task.id}`
                                );
                                flash.success('Sao chép thành công!');
                                window.location.reload();
                            } catch (err) {
                                flash.error('Sao chép thất bại!');
                            } finally {
                                loading.hide();
                            }
                        }}
                    >
                        Sao chép
                    </div>
                ),
                key: '2',
                disabled: !canEdit,
            },
            set_start,
            request_approval,
            approve,
            reject,
            complete,
            cancel,
            {
                label: (
                    <div
                        onClick={() => {
                            confirm_popup.showAlert(
                                'Are you sure you want to delete this task? This action can not be undone.',
                                (choose) => {
                                    if (choose) {
                                        const deleteTask = async () => {
                                            try {
                                                loading.show();
                                                await api.delete(
                                                    `/api/task/delete/${task.id}`
                                                );
                                                flash.success(
                                                    'Xóa thành công!'
                                                );
                                                window.location.reload();
                                            } catch (err) {
                                                console.error(err);
                                                flash.error('Xóa thất bại!');
                                            } finally {
                                                loading.hide();
                                            }
                                        };
                                        deleteTask();
                                    }
                                }
                            );
                        }}
                    >
                        Xóa
                    </div>
                ),
                key: '3',
                disabled: !canDelete,
                danger: true,
            },
        ],
    };
};

const getColumns = (user, users) => {
    return [
        {
            title: 'Công việc',
            dataIndex: 'name',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Dự án',
            dataIndex: 'project',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'start_date',
            width: 150,
            render: (e) => {
                return e ? DateHelpers.formatDate(e, 'DD/MM/YYYY') : '';
            },
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'end_date',
            width: 150,
            render: (e) => {
                return e ? DateHelpers.formatDate(e, 'DD/MM/YYYY') : '';
            },
        },
        {
            title: 'Người phụ trách',
            dataIndex: 'manager_id',
            width: 200,
            render: (e) => {
                const user = Arr.findById(users, e);
                return user? user.name : 'Không có dữ liệu';
            },
        },
        {
            title: 'Người tham gia',
            dataIndex: 'participant_id',
            width: 200,
            render: (e) => {
                const user = Arr.findById(users, e);
                return user? user.name : 'Không có dữ liệu';
            }
        },
        {
            title: 'Khách hàng liên quan',
            dataIndex: 'account_export',
            width: 200,
            render: (e) => {
                return e ? e.name : 'Không có dữ liệu';
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 150,
            render: (e) => {
                return e
                    ? TaskStatus.fromContext(e)?.label
                    : 'Không có dữ liệu';
            },
        },
        {
            title: '',
            key: 'action',
            render: (e) => {
                return (
                    <Dropdown
                        menu={getActions(e, user)}
                        className="hover:cursor-pointer font-medium"
                    >
                        <MoreOutlined />
                    </Dropdown>
                );
            },
            width: 30,
            fixed: 'right',
        },
    ];
};

const TaskPage = () => {
    const { styles } = useStyle();
    const [load, setLoad] = useState(false);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [params, setParams] = useState({
        pagination: {
            current: 0 + 1, // current page, page index
            pageSize: 10, // ipp
        },
        filters: {
            manager_id: 0,
            participant_id: 0,
            status: 0,
            period: 0,
        },
        query: '',
    });

    const [users, setUsers] = useState(Client.get('users') || []);

    useEffect(() => {
        const unsubscribe = Client.subscribe(() => {
            setUsers(Client.get('users') || []);
        });
        return () => unsubscribe();
    }, []);

    const getParams = () => {
        return {
            page: params?.pagination?.current - 1 || 0,
            ipp: params?.pagination?.pageSize || 10,
            manager_id: params?.filters?.manager_id || 0,
            participant_id: params?.filters?.participant_id || 0,
            status: params?.filters?.status || 0,
            period: params?.filters?.period || 0,
            query: params?.query || '',
        };
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setParams({
            ...params,
            pagination,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== params.pagination?.pageSize) {
            setData([]);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoad(true);
            try {
                const query_params = getParams();
                const response = await api.get(`/api/task/list`, {
                    params: query_params,
                });
                setData(response.data?.content || []);
                setParams((prev_params) => ({
                    ...prev_params,
                    pagination: {
                        ...prev_params.pagination,
                        total: response.data.totalElements,
                    },
                }));
            } catch (err) {
                setData([]);
            } finally {
                setLoad(false);
            }
        };
        fetchData();
    }, [
        params.pagination.current,
        params.pagination.pageSize,
        params.filters.manager_id,
        params.filters.participant_id,
        params.filters.status,
        params.filters.period,
        params.query,
    ]);

    return (
        <div className="task-page">
            <Header icon={<CgWorkAlt />} title={'Công việc'} />
            <MainContent className="task-page-content">
                <div className="text-lg font-semibold">Danh sách công việc</div>
                <div className="search-bar flex flex-row items-center justify-between gap-4 pb-3">
                    <div className="flex flex-row items-center gap-2 w-full max-w-[800px]">
                        <Input.Search
                            placeholder="Tìm tên công việc"
                            allowClear
                            onSearch={(value) => {
                                setParams((prev_params) => ({
                                    ...prev_params,
                                    query: value.trim(),
                                }));
                            }}
                            className="flex-1"
                        />
                        <Select
                            className="flex-1"
                            placeholder="Người phụ trách"
                            showSearch
                            optionFilterProp="label"
                            options={users.map((item) => {
                                return {
                                    value: item.id,
                                    label: item.name,
                                };
                            })}
                            allowClear
                            onChange={(value) => {
                                setParams((prev_params) => ({
                                    ...prev_params,
                                    filters: {
                                        ...prev_params.filters,
                                        manager_id: value,
                                    },
                                }));
                            }}
                        />
                        <Select
                            placeholder="Người tham gia"
                            className="flex-1"
                            showSearch
                            optionFilterProp="label"
                            options={users.map((item) => {
                                return {
                                    value: item.id,
                                    label: item.name,
                                };
                            })}
                            allowClear
                            onChange={(value) => {
                                setParams((prev_params) => ({
                                    ...prev_params,
                                    filters: {
                                        ...prev_params.filters,
                                        participant_id: value,
                                    },
                                }));
                            }}
                        />
                        <Select
                            placeholder="Trạng thái"
                            className="flex-1"
                            showSearch
                            optionFilterProp="label"
                            options={TaskStatus.getTaskStatuses().map(
                                (item) => {
                                    return {
                                        value: item.id,
                                        label: item.label,
                                    };
                                }
                            )}
                            allowClear
                            onChange={(value) => {
                                setParams((prev_params) => ({
                                    ...prev_params,
                                    filters: {
                                        ...prev_params.filters,
                                        status: value,
                                    },
                                }));
                            }}
                        />
                        {/* <Select placeholder="Thời gian" /> */}
                    </div>
                    <div>
                        <Button
                            className="btn bg-[#233F80] text-white hover:bg-[#233F80]/90"
                            onClick={() => {
                                drawer.showForm({
                                    title: 'Thêm mới công việc',
                                    url: '/api/task/create',
                                    callback: () => {
                                        flash.success('Thêm mới thành công!');
                                        navigate(0);
                                    },
                                    width: 718,
                                    submit: 'Thêm mới',
                                    content: (
                                        <TaskDrawerForm />
                                    ),
                                });
                            }}
                        >
                            Thêm mới
                        </Button>
                    </div>
                </div>
                <div className="w-full">
                    <ConfigProvider renderEmpty={renderEmpty}>
                        <Table
                            className={styles.customTable}
                            rowKey={(e) => e.id}
                            bordered
                            columns={getColumns(user, users)}
                            dataSource={data}
                            pagination={{
                                ...params.pagination,
                                showSizeChanger: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} items`,
                                pageSizeOptions: [10, 20, 50, 100, 500],
                            }}
                            loading={load}
                            onChange={handleTableChange}
                            locale={{
                                emptyText: (
                                    <Empty description="No Data"></Empty>
                                ),
                            }}
                            scroll={{
                                x: 'max-content',
                                y: 485,
                            }}
                        />
                    </ConfigProvider>
                </div>
            </MainContent>
        </div>
    );
};

export default TaskPage;
