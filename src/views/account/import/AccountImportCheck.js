import React, { useEffect, useState } from 'react';
import Arr from '../../../utils/Array';
import DateHelpers from '../../../utils/Date';
import Gender from '../../../utils/Gender';
import { Button, ConfigProvider, Empty, Switch, Table } from 'antd';
import { createStyles } from 'antd-style';
import Client from '../../../utils/client.manager';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/Axios';
import popup from '../../../utils/popup/Popup';

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

const getColumns = (relationships, sources, users = []) => {
    return [
        {
            title: 'Tên khách hàng',
            dataIndex: 'name',
            width: 150,
            fixed: 'left',
            render: (text, e) => {
                return <div>{text}</div>;
            },
        },
        {
            title: 'Mã KH',
            dataIndex: 'code',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            width: 150,
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            width: 100,
            render: (e) => {
                return Gender.fromContext(e)?.label || 'Khác';
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 200,
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthday',
            width: 150,
            render: (e) => {
                return e ? DateHelpers.formatDate(e, 'DD/MM/YYYY') : '';
            },
        },
        {
            title: 'Người phụ trách',
            width: 150,
            dataIndex: 'assignedUserId',
            render: (e) => {
                const user = Arr.findById(users, e);
                return user?.name || 'Không có dữ liệu';
            },
        },
        {
            title: 'Ngành nghề',
            dataIndex: 'job',
            width: 200,
        },
        {
            title: 'Người giới thiệu',
            dataIndex: 'referrerId',
            width: 150,
            render: (e) => {
                const user = Arr.findById(users, e);
                return user?.name || 'Không có dữ liệu';
            },
        },
        {
            title: 'Nguồn',
            dataIndex: 'sourceId',
            width: 150,
            render: (e) => {
                const source = Arr.findById(sources, e);
                return source ? source.name : 'Không có dữ liệu';
            },
        },
        {
            title: 'Mối quan hệ',
            dataIndex: 'relationshipId',
            width: 150,
            render: (e) => {
                const relationship = Arr.findById(relationships, e);
                return relationship ? relationship.name : 'Không có dữ liệu';
            },
        },
    ];
};

const AccountImportCheck = (props) => {
    const [relationships, setRelationships] = useState(
        Client.get('relationships')
    );
    const [sources, setSources] = useState(Client.get('sources'));
    const [users, setUsers] = useState(Client.get('users'));
    const [ignore_error, setIgnore] = useState(
        props?.data?.ignore_error || false
    );
    const [override, setOverride] = useState(
        props?.data?.allow_override || false
    );

    useEffect(() => {
        const unsubscribe = Client.subscribe(() => {
            setRelationships(Client.get('relationships') || []);
            setSources(Client.get('sources') || []);
            setUsers(Client.get('users') || []);
        });

        return () => unsubscribe();
    }, []);

    const { styles } = useStyle();
    const navigate = useNavigate();

    const handleSubmit = () => {
        props.callback(true); // Báo hiệu bắt đầu xử lý

        (async () => {
            try {
                const formData = new FormData();
                // Object options (ignore_error & allow_override)
                const options = {
                    ignore_error: true,
                    allow_override: false,
                };
                formData.append('options', JSON.stringify(options));
                formData.append(
                    'accounts',
                    JSON.stringify(props.data.list || [])
                );

                const response = await api.post(
                    `/api/account/import/save`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data', // Đảm bảo gửi đúng kiểu dữ liệu
                        },
                    }
                );

                props.onImport(response.data);

                
            } catch (err) {
                console.log(err);
                popup.error(
                    err?.response?.data?.message ||
                        err.message ||
                        'Tải lên khách hàng thất bại'
                );
            } finally {
                props.callback(false); // Báo hiệu kết thúc xử lý
            }
        })();
    };

    return (
        <div className="flex items-center justify-center pt-3">
            <div className="max-w-[1000px] w-full">
                <div className="pb-3 pt-4 flex flex-row items-center justify-between">
                    <div className="font-medium text-xl">
                        Danh sách khách hàng
                    </div>
                    <div className="flex flex-row gap-2">
                        <Button type="primary" onClick={handleSubmit}>Xác nhận</Button>
                        <Button onClick={() => navigate(0)}>Hủy</Button>
                    </div>
                </div>
                <ConfigProvider renderEmpty={renderEmpty}>
                    <Table
                        className={styles.customTable}
                        columns={getColumns(relationships, sources, users)}
                        rowKey={(e) => e.id}
                        bordered
                        dataSource={props.data.list}
                        pagination={{
                            showSizeChanger: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`,
                            pageSizeOptions: [10, 20, 50, 100, 500],
                        }}
                        locale={{
                            emptyText: <Empty description="No Data"></Empty>,
                        }}
                        scroll={{
                            x: 'max-content',
                            y: 280,
                        }}
                    />
                </ConfigProvider>
                <div className="font-medium text-xl pt-3 pb-3">Lựa chọn</div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row items-center gap-2">
                        <Switch
                            checked={ignore_error}
                            onChange={(value) => setIgnore(value)}
                        />
                        <div>Bỏ qua lỗi</div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <Switch
                            checked={override}
                            onChange={(v) => setOverride(v)}
                        />
                        <div>Cho phép ghi đè</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountImportCheck;
