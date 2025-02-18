import { Button, ConfigProvider, Empty, Input, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import InputSelect from '../../../components/form/inputs/InputSelect';
import { createStyles } from 'antd-style';
import api from '../../../utils/Axios';
import DateHelpers from '../../../utils/Date';
import AccountStatus from '../AccountStatus';

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

const getColumns = () => {
    return [
        {
            title: 'Công việc',
            dataIndex: 'task',
        },
        {
            title: 'Dự án',
            dataIndex: 'project',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            render: (e) => {
                return e ? DateHelpers.formatDate(e, 'DD/MM/YYYY') : '';
            },
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            render: (e) => {
                return e ? DateHelpers.formatDate(e, 'DD/MM/YYYY') : '';
            },
        },
        {
            title: 'Trạng thái',
            dataIndex:'status',
            render: (e) => {
                return e ? AccountStatus.fromContext(e)?.label : 'Không có dữ liệu';
            },
        }
    ];
};

const AccountTask = ({ account }) => {
    const { styles } = useStyle();
    const [load, setLoad] = useState(false);
    const [data, setData] = useState([]);
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

    const onSearch = (value) => {
        setParams({
            ...params,
            query: value.trim(),
        });
    };

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
                const response = await api.get(`/api/task/account/${account.id}`, {
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
        <div className="account-task">
            <div class="search-bar">
                <Input.Search placeholder="Tìm tên công việc" allowClear />
                <Select placeholder="Người nhận việc" />
                <Select placeholder="Người giao việc" />
                <Select placeholder="Trạng thái" />
                <Select placeholder="Thời gian" />
                <Button>Thêm mới</Button>
            </div>
            <div className="w-full">
                <ConfigProvider renderEmpty={renderEmpty}>
                    <Table
                        className={styles.customTable}
                        rowKey={(e) => e.id}
                        bordered
                        columns={getColumns()}
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
                            emptyText: <Empty description="No Data"></Empty>,
                        }}
                        scroll={{
                            x: 'max-content',
                            y: 485,
                        }}
                    />
                </ConfigProvider>
            </div>
        </div>
    );
};

export default AccountTask;
