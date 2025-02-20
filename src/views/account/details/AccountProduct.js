import { Button, ConfigProvider, DatePicker, Empty, Input, Table } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/Axios';
import { render } from 'sass';
import DateHelpers from '../../../utils/Date';
import drawer from '../../../utils/Drawer';
import flash from '../../../utils/Flash';
import APDrawerForm from '../../../components/account/APDrawerForm';
import Dropdown from 'antd/es/dropdown/dropdown';
import { MoreOutlined } from '@ant-design/icons';
import loading from '../../../utils/Loading';
import confirm_popup from '../../../utils/popup/ConfirmPopup';
import dayjs from 'dayjs';
const renderEmpty = (component_name) => {
    if (component_name === 'Table.filter') {
        return (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" />
        );
    }
};

const formatNumber = (e) => {
    return `${e}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const getActions = (product) => {
    const acl = product.acl;
    const canEdit = !!product?.acl?.edit;
    const canDelete = !!product?.acl?.delete;

    return {
        items: [
            {
                label: (
                    <div
                        onClick={() => {
                            drawer.showForm({
                                title: 'Cập nhật sản phẩm',
                                url: `/api/account/product/edit/${product.id}`,
                                callback: () => {
                                    flash.success('Cập nhật thành công!');
                                    window.location.reload();
                                },
                                width: 600,
                                submit: 'Cập nhật',
                                content: <APDrawerForm value={product} />,
                            });
                        }}
                    >
                        Sửa
                    </div>
                ),
                key: '1',
                disable: !canEdit,
            },
            {
                label: (
                    <div
                        onClick={() => {
                            try {
                                (async () => {
                                    loading.show();
                                    const response = await api.post(
                                        `/api/account/product/duplicate/${product.id}`
                                    );
                                    flash.success('Sao chép thành công!');
                                    window.location.reload();
                                })();
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
                disable: !canEdit,
            },
            {
                label: (
                    <div
                        onClick={() => {
                            confirm_popup.showAlert(
                                'Are you sure you want to delete this product? This action can not be undone.',
                                (choose) => {
                                    if (choose) {
                                        const deleteProduct = async () => {
                                            try {
                                                loading.show();
                                                await api.delete(
                                                    `/api/account/product/delete/${product.id}`
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
                                        deleteProduct();
                                    }
                                }
                            );
                        }}
                    >
                        Xóa
                    </div>
                ),
                key: '3',
                disable: !canDelete,
                danger: true,
            },
        ],
    };
};

const getColumns = () => {
    return [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Nhóm sản phẩm',
            dataIndex: 'category',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            width: 150,
            render: (e) => {
                return formatNumber(e);
            },
        },
        {
            title: 'Giá sản phẩm',
            dataIndex: 'price',
            render: (e) => {
                return formatNumber(e.toFixed(2)) + ' VND';
            },
        },
        {
            title: 'Thuế',
            dataIndex: 'tax',
            render: (e) => {
                let text = 0;
                if (e) {
                    text = formatNumber(e.toFixed(2));
                }
                return `${text} %`;
            },
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discount',
            render: (e) => {
                let text = 0;
                if (e) {
                    text = formatNumber(e.toFixed(2));
                }
                return `${text} %`;
            },
        },
        {
            title: 'Tổng giá trị',
            dataIndex: 'total',
            render: (e) => {
                let text = 0;
                if (e) {
                    text = formatNumber(e.toFixed(2));
                }
                return text + ' VND';
            },
        },
        {
            title: '',
            key: 'action',
            width: 30,
            render: (e) => {
                return (
                    <Dropdown
                        className="hover:cursor-pointer font-medium"
                        menu={getActions(e)}
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

const AccountProduct = ({ account }) => {
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
                    `/api/account/product/list/${account.id}`,
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
        <div className="account-product">
            <div className="search-bar flex flex-row items-center justify-between gap-4 pb-3">
                <div className="flex flex-row items-center gap-2 w-full max-w-[800px]">
                    <Input.Search
                        placeholder="Tìm tên, nhóm sản phẩm"
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
                                    end: date
                                        ? +dayjs(date, 'DD-MM-YYYY')
                                        : 0,
                                },
                            }));
                        }}
                        placeholder="Ngày kết thúc"
                    />
                </div>
                <div>
                    <Button
                        className="btn bg-[#233F80] text-white hover:bg-[#233F80]/90"
                        onClick={() => {
                            drawer.showForm({
                                title: 'Thêm mới sản phẩm',
                                url: '/api/account/product/create',
                                callback: () => {
                                    flash.success('Thêm mới thành công!');
                                    navigate(0);
                                },
                                width: 600,
                                submit: 'Thêm mới',
                                content: <APDrawerForm account={account} />,
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
                            y: 455,
                        }}
                        expandable={{
                            expandedRowRender: (record) => {
                                return (
                                    <div>
                                        <div>
                                            <b>Lần cập nhật gần nhất:</b>{' '}
                                            {DateHelpers.formatDate(
                                                record.last_update,
                                                'DD-MM-YYYY'
                                            )}
                                        </div>
                                        <p>
                                            <b>Mô tả:</b> {record.description}
                                        </p>
                                    </div>
                                );
                            },
                            rowExpandable: (record) => {
                                console.log(record);
                                if (record.description) {
                                    return true;
                                }

                                return false;
                            },
                        }}
                    />
                </ConfigProvider>
            </div>
        </div>
    );
};

export default AccountProduct;
