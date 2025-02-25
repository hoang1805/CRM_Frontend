import { Button, ConfigProvider, DatePicker, Empty, Input, Table } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/Axios';
import dayjs from 'dayjs';
import drawer from '../../../utils/Drawer';
import loading from '../../../utils/Loading';
import flash from '../../../utils/Flash';

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

const getColumns = () => {
    return [
        {
            title: 'Ngày đánh giá',
            dataIndex: 'created_at',
            render: (date) => dayjs(date).format('DD-MM-YYYY HH:mm:ss'),
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            width: 200,
            render: (e) => {
                return `${e || 0} / 5`;
            }
        },
    ];
};
const AccountFeedback = ({ account }) => {
    const { styles } = useStyle();
    const [load, setLoad] = useState(false);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [params, setParams] = useState({
        pagination: {
            current: 0 + 1, // current page, page index
            pageSize: 10, // ipp
        },
        filters: {
            start: 0,
            end: 0,
        },
        query: '',
    });

    const getParams = () => {
        return {
            page: params?.pagination?.current - 1 || 0,
            ipp: params?.pagination?.pageSize || 10,
            start: params?.filters?.start || 0,
            end: params?.filters?.end || 0,
            query: params?.query || '',
        };
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setParams({ ...params, pagination });
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
                const response = await api.get(
                    `/api/feedback/list/${account.id}`,
                    {
                        params: query_params,
                    }
                );
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
        if (!account?.id) {
            return;
        }
        fetchData();
    }, [
        account,
        params.pagination.current,
        params.pagination.pageSize,
        params.filters.start,
        params.filters.end,
        params.query,
    ]);
    return (
        <div className="account-feedback">
            <div className="search-bar flex flex-row items-center justify-between gap-4 pb-3">
                <div className="flex flex-row items-center gap-2 w-full max-w-[800px]">
                    <Input.Search
                        placeholder="Tìm nội dung"
                        allowClear
                        onSearch={(value) => {
                            setParams((prev_params) => ({
                                ...prev_params,
                                query: value.trim(),
                            }));
                        }}
                        className="flex-1"
                    />
                    <DatePicker
                        className="flex-1"
                        format={'DD-MM-YYYY'}
                        onChange={(value, date) => {
                            setParams((prev_params) => ({
                                ...prev_params,
                                filters: {
                                    ...prev_params.filters,
                                    start: date
                                        ? +dayjs(date, 'DD-MM-YYYY')
                                        : 0,
                                },
                            }));
                        }}
                        placeholder="Ngày bắt đầu"
                    />
                    <DatePicker
                        className="flex-1"
                        format={'DD-MM-YYYY'}
                        onChange={(value, date) => {
                            setParams((prev_params) => ({
                                ...prev_params,
                                filters: {
                                    ...prev_params.filters,
                                    end: date ? +dayjs(date, 'DD-MM-YYYY') : 0,
                                },
                            }));
                        }}
                        placeholder="Ngày kết thúc"
                    />
                </div>
                <div>
                    <Button
                        className="btn bg-[#233F80] text-white hover:bg-[#233F80]/90"
                        onClick={async () => {
                            try {
                                loading.show();
                                const response = await api.post(
                                    `/api/feedback/request.account/${account.id}`
                                );
                                flash.success(
                                    'Gửi mail đánh giá cho khách hàng thành công'
                                );
                            } catch (e) {
                                if (e.response?.status === 429) {
                                    flash.error(
                                        'Bạn đã gửi mail đánh giá cho khách hàng. Vui lòng thử lại sau 15 phút.'
                                    );
                                } else {
                                    flash.error('Gửi mail đánh giá thất bại');
                                }
                            } finally {
                                loading.hide();
                            }
                        }}
                    >
                        Gửi mail đánh giá
                    </Button>
                </div>
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
                            y: 410,
                        }}
                        expandable={{
                            expandedRowRender: (record) => {
                                return (
                                    <div>
                                        <div className="font-medium">
                                            Nội dung:
                                        </div>
                                        <div>{record.content || "Không có"}</div>
                                    </div>
                                );
                            },
                        }}
                    />
                </ConfigProvider>
            </div>
        </div>
    );
};

export default AccountFeedback;
