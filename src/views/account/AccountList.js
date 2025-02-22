import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/page/Header';
import { PiUsersThreeFill } from 'react-icons/pi';
import MainContent from '../../components/page/MainContent';
import Arr from '../../utils/Array';
import Gender from '../../utils/Gender';
import DateHelpers from '../../utils/Date';
import drawer from '../../utils/Drawer';
import AccountForm from '../../components/account/AccountForm';
import flash from '../../utils/Flash';
import confirm from '../../utils/popup/ConfirmPopup';
import load from '../../utils/Loading';
import api from '../../utils/Axios';
import Client from '../../utils/client.manager';
import { useNavigate } from 'react-router-dom';
import { createStyles } from 'antd-style';
import {
    Button,
    ConfigProvider,
    Empty,
    Input,
    Table,
    Tag,
    Tooltip,
} from 'antd';
import {
    DeleteOutlined,
    LeftOutlined,
    RightOutlined,
    UserOutlined,
    VerticalAlignBottomOutlined,
    VerticalAlignTopOutlined,
} from '@ant-design/icons';
import loading from '../../utils/Loading';
import helpers from '../../utils/Helpers';
import popup from '../../utils/popup/Popup';
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

const getColumns = (relationships, sources, navigate, users = []) => {
    return [
        {
            title: 'Tên khách hàng',
            dataIndex: 'name',
            width: 150,
            fixed: 'left',
            ellipsis: true,
            render: (text, e) => {
                return <a href={`/account/${e.id}`}>{text}</a>
            },
        },
        {
            title: 'Mã KH',
            dataIndex: 'code',
            width: 150,
            fixed: 'left',
            ellipsis: true,
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
            ellipsis: true,
        },
        {
            title: 'Người phụ trách',
            width: 150,
            dataIndex: 'assignedUserId',
            ellipsis: true,
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
            ellipsis: true,
            width: 150,
            render: (e) => {
                const user = Arr.findById(users, e);
                return user?.name || 'Không có dữ liệu';
            },
        },
        {
            title: 'Nguồn',
            dataIndex: 'sourceId',
            ellipsis: true,
            width: 150,
            render: (e) => {
                const source = Arr.findById(sources, e);
                return source ? source.name : 'Không có dữ liệu';
            },
        },
        {
            title: 'Người tạo',
            width: 150,
            dataIndex: 'creatorId',
            ellipsis: true,
            render: (e) => {
                const user = Arr.findById(users, e);
                return user?.name || 'Không có dữ liệu';
            },
        },
        {
            title: 'Mối quan hệ',
            dataIndex: 'relationshipId',
            ellipsis: true,
            width: 150,
            render: (e) => {
                const relationship = Arr.findById(relationships, e);
                return relationship ? relationship.name : 'Không có dữ liệu';
            },
        },
        {
            title: 'Ngày tạo',
            width: 150,
            dataIndex: 'createdAt',
            ellipsis: true,
            render: (e) => {
                return e ? DateHelpers.formatDate(e, 'DD/MM/YYYY HH:mm') : '';
            },
        },
        {
            title: 'Cập nhật lần cuối',
            dataIndex: 'lastUpdate',
            ellipsis: true,
            width: 150,
            render: (e) => {
                return e ? DateHelpers.formatDate(e, 'DD/MM/YYYY HH:mm') : '';
            },
        },
        {
            title: 'Thao tác',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (e) => {
                const acl = e.acl;
                console.log(e);
                return (
                    <>

                        <button
                            className="btn btn-circle btn-text btn-sm"
                            aria-label="Action button"
                            disabled={!(acl?.edit || acl?.edit == null)}
                            onClick={() => {
                                navigate(`/account/edit/${e.id}`);
                            }}
                        >
                            <span className="icon-[tabler--pencil] size-5"></span>
                        </button>

                        {acl?.delete || acl?.delete == null ? (
                            <button
                                className="btn btn-circle btn-text btn-sm"
                                aria-label="Action button"
                                onClick={() => {
                                    confirm.show(
                                        'Are you sure you want to delete this relationship? This action can not be undone.',
                                        (choose) => {
                                            if (choose) {
                                                const deleteRelationship =
                                                    async () => {
                                                        try {
                                                            load.show();
                                                            const response =
                                                                await api.delete(
                                                                    `/api/account/delete/${e.id}`
                                                                );
                                                            flash.success(
                                                                'Xóa thành công!'
                                                            );
                                                            navigate(0);
                                                        } catch (err) {
                                                            popup.error(
                                                                'Xóa thất bại!'
                                                            );
                                                            console.error(err);
                                                        } finally {
                                                            load.hide();
                                                        }
                                                    };
                                                deleteRelationship();
                                            }
                                        }
                                    );
                                }}
                            >
                                <span className="icon-[tabler--trash] size-5"></span>
                            </button>
                        ) : (
                            ''
                        )}
                    </>
                );
            },
        },
    ];
};

const AccountList = () => {
    const [relationships, setRelationships] = useState(
        Client.get('relationships')
    );
    const [sources, setSources] = useState(Client.get('sources'));
    const [users, setUsers] = useState(Client.get('users'));

    const [load, setLoad] = useState(false);
    const [data, setData] = useState([]);

    const [relationship, setRelationship] = useState(0);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const scrollContainer = useRef(null);

    const { styles } = useStyle();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    // Cuộn danh sách khi nhấn nút
    const scroll = (direction) => {
        if (scrollContainer.current) {
            scrollContainer.current.scrollBy({
                left: direction * 100,
                behavior: 'smooth',
            });
        }
    };

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    const [params, setParams] = useState({
        pagination: {
            current: 0 + 1, // current page, page index
            pageSize: 10, // ipp
        },
        filters: {
            relationship_id: 0,
        },
    });
    const navigate = useNavigate();

    const getParams = () => {
        return {
            page: params?.pagination?.current - 1 || 0,
            ipp: params?.pagination?.pageSize || 10,
            relationship_id: params?.filters?.relationship_id || 0,
            query: params?.query || '',
        };
    };

    // Kiểm tra xem có thể scroll trái/phải không
    const checkScroll = () => {
        if (scrollContainer.current) {
            setCanScrollLeft(scrollContainer.current.scrollLeft > 0);
            setCanScrollRight(
                scrollContainer.current.scrollLeft +
                scrollContainer.current.clientWidth <
                scrollContainer.current.scrollWidth
            );
        }
    };

    const onSearch = (value) => {
        setParams({
            ...params,
            query: value.trim(),
        });
    };

    useEffect(() => {
        const unsubscribe = Client.subscribe(() => {
            setRelationships(Client.get('relationships') || []);
            setSources(Client.get('sources') || []);
            setUsers(Client.get('users') || []);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        checkScroll();
        const container = scrollContainer.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            return () => container.removeEventListener('scroll', checkScroll);
        }
    }, []);

    useEffect(() => {
        setParams({
            ...params,
            pagination: {
                ...params.pagination,
                current: 1,
            },
            filters: {
                ...params.filters,
                relationship_id: relationship,
            },
        });
    }, [relationship]);

    useEffect(() => {
        const fetchData = async () => {
            setLoad(true);
            try {
                const response = await api.get('/api/account/list', {
                    params: getParams(),
                });
                setData(response.data?.content || []);
                setParams({
                    ...params,
                    pagination: {
                        ...params.pagination,
                        total: response.data.totalElements,
                    },
                });
            } catch (err) {
                setData([]);
                console.error(err);
            } finally {
                setSelectedRowKeys([]);
                setLoad(false);
            }
        };
        fetchData();
    }, [
        params.pagination?.current,
        params.pagination?.pageSize,
        params.filters?.relationship_id,
        params?.query,
    ]);

    const handleTableChange = (pagination, filters, sorter) => {
        setParams({
            ...params,
            pagination,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== params.pagination?.pageSize) {
            setData([]);
            setSelectedRowKeys([]);
        }
    };

    return (
        <div className="account-list-page">
            <Header
                icon={<PiUsersThreeFill className="icon" />}
                title={'Khách hàng'}
                subtitle={'Danh sách khách hàng'}
            ></Header>
            <MainContent className="account-list-content">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="text-lg font-semibold">
                                Danh sách khách hàng
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row mb-3 justify-between gap-2">
                        <div className="flex flex-row gap-2">
                            <div className="tab-container flex flex-row items-center">
                                <div className="tab-all">
                                    <Tag
                                        key={'Tất cả'}
                                        onClick={() => setRelationship(0)}
                                        className={`hover:cursor-pointer hover:opacity-60 ${relationship === 0
                                            ? 'font-bold'
                                            : ''
                                            }`}
                                    >
                                        Tất cả
                                    </Tag>
                                </div>
                                <div className="others-container flex flex-row items-center">
                                    <Button
                                        icon={<LeftOutlined />}
                                        disabled={!canScrollLeft}
                                        onClick={() => scroll(-1)}
                                        className="size-[22px] mr-[7px]"
                                        style={{
                                            width: '22px',
                                            height: '22px',
                                        }}
                                    />
                                    <div
                                        ref={scrollContainer}
                                        className="flex flex-row"
                                        style={{
                                            gap: '0px',
                                            overflowX: 'auto',
                                            whiteSpace: 'nowrap',
                                            scrollBehavior: 'smooth',
                                            maxWidth: '600px', // Điều chỉnh độ rộng phù hợp
                                            padding: '5px 0',
                                            scrollbarWidth: 'none', // Ẩn scrollbar trên Firefox
                                            msOverflowStyle: 'none', // Ẩn scrollbar trên IE
                                        }}
                                    >
                                        {relationships?.map((item) => (
                                            <Tag
                                                color={item.color}
                                                key={item.name}
                                                onClick={() =>
                                                    setRelationship(item.id)
                                                }
                                                className={`hover:cursor-pointer hover:opacity-60 ${relationship === item.id
                                                    ? 'font-bold'
                                                    : ''
                                                    }`}
                                            >
                                                {item.name}
                                            </Tag>
                                        ))}
                                    </div>
                                    <Button
                                        icon={<RightOutlined />}
                                        disabled={!canScrollRight}
                                        onClick={() => scroll(1)}
                                        className="size-[22px] ml-[5px]"
                                        style={{
                                            width: '22px',
                                            height: '22px',
                                        }}
                                    />
                                </div>
                            </div>
                            <Input.Search
                                onSearch={onSearch}
                                placeholder="Nhập tên, SĐT, Mã KH"
                                prefix={<UserOutlined />}
                                allowClear
                                className="max-w-72 w-full"
                            />
                        </div>
                        <div className="quick-actions flex flex-row gap-2 items-center">
                            <div className='text-sm'>
                                {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
                            </div>
                            <Tooltip
                                placement="top"
                                title="Xóa nhanh"
                                arrow={false}
                            >
                                <Button
                                    disabled={!hasSelected}
                                    color="#233F80"
                                    className="bg-[#233F80] text-white hover:bg-[#233F80]/90"
                                    onClick={() => {
                                        confirm.show('Are you sure you want to delete these accounts? This action can not be undone.', (choose) => {
                                            if (choose) {
                                                const deleteAccounts = async () => {
                                                    try {
                                                        loading.show();
                                                        const response = await api.delete(
                                                            '/api/account/delete.many',
                                                            {
                                                                data: selectedRowKeys,
                                                            }
                                                        );
                                                        flash.success('Xóa thành công!');
                                                        setSelectedRowKeys([]);
                                                        navigate(0);
                                                    } catch (err) {
                                                        console.error(err);
                                                    } finally {
                                                        loading.hide();
                                                    }
                                                };
                                                deleteAccounts();
                                            }
                                        })
                                    }}
                                >
                                    <DeleteOutlined
                                        style={{ fontSize: '22px' }}
                                    />
                                </Button>
                            </Tooltip>
                            <Tooltip
                                placement="top"
                                title="Tải xuống danh sách khách hàng"
                                arrow={false}
                            >
                                <Button
                                    disabled={!hasSelected}
                                    color="#233F80"
                                    className="bg-[#233F80] text-white hover:bg-[#233F80]/90"
                                    onClick={async () => {
                                        try {
                                            loading.show();
                                            const response = await api.post('/api/account/export',
                                                selectedRowKeys
                                                , { responseType: 'blob' });
                                            console.log(response);

                                            const disposition = response.headers['content-disposition'];
                                            let fileName = 'export.xlsx'; // Đặt mặc định
                                            if (disposition) {
                                                const match = disposition.match(/filename="?(.+?)"?$/);
                                                if (match) fileName = match[1];
                                            }

                                            // console.log(response);

                                            // Tạo URL để tải xuống file
                                            const url = window.URL.createObjectURL(new Blob([response.data]));
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.setAttribute('download', fileName);
                                            document.body.appendChild(link);
                                            link.click();
                                            link.remove();
                                            window.URL.revokeObjectURL(url);
                                            flash.success('Tải xuống thành công');
                                        } catch (err) {
                                            console.log(err);
                                            flash.error('Tải xuống thất bại');
                                        } finally {
                                            loading.hide();
                                        }
                                    }}
                                >
                                    <VerticalAlignBottomOutlined
                                        style={{ fontSize: '22px' }}
                                    />
                                </Button>
                            </Tooltip>
                            <Tooltip
                                placement="top"
                                title="Tải lên danh sách khách hàng"
                                arrow={false}
                            >
                                <Button
                                    color="#233F80"
                                    className="bg-[#233F80] text-white hover:bg-[#233F80]/90"
                                    onClick={() => navigate('/account/import')}
                                >
                                    <VerticalAlignTopOutlined
                                        style={{ fontSize: '22px' }}
                                    />
                                </Button>
                            </Tooltip>
                            <Button
                                color="#233F80"
                                className="bg-[#233F80] text-white hover:bg-[#233F80]/90"
                                onClick={() => navigate('/account/create')}
                            >
                                Thêm mới
                            </Button>
                        </div>
                    </div>
                    <div className="w-full">
                        <ConfigProvider renderEmpty={renderEmpty}>
                            <Table
                                className={styles.customTable}
                                rowSelection={rowSelection}
                                columns={getColumns(
                                    relationships,
                                    sources,
                                    navigate,
                                    users
                                )}
                                rowKey={(e) => e.id}
                                bordered
                                dataSource={data}
                                pagination={{
                                    ...params.pagination,
                                    showSizeChanger: true,
                                    showTotal: (total, range) =>
                                        `${range[0]}-${range[1]} of ${total} items`,
                                    pageSizeOptions: [
                                        10, 20, 50, 100, 500,
                                    ],
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
                </div>
            </MainContent>
        </div>
    );
};

export default AccountList;
