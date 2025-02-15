import React, { useEffect, useState } from 'react';
import Header from '../../components/page/Header';
import { PiUsersThreeFill } from 'react-icons/pi';
import MainContent from '../../components/page/MainContent';
import { render } from 'sass';
import Arr from '../../utils/Array';
import Gender from '../../utils/Gender';
import DateHelpers from '../../utils/Date';
import drawer from '../../utils/Drawer';
import AccountForm from '../../components/account/AccountForm';
import flash from '../../utils/Flash';
import confirm_popup from '../../utils/popup/ConfirmPopup';
import loading from '../../utils/Loading';
import api from '../../utils/Axios';
import error_popup from '../../utils/popup/ErrorPopup';
import Client from '../../utils/client.manager';
import { useNavigate } from 'react-router-dom';
import PaginatedTable from '../../components/table/PaginatedTable';

const EmptyState = () => {
    return (
        <div className="min-h-60 w-full flex items-center justify-center">
            <div className="flex items-center justify-center flex-col">
                <span className="icon-[tabler--brand-google-drive] mb-2 size-10"></span>
                <div className="text-lg font-medium">No data to show.</div>
            </div>
        </div>
    );
};

const LoadingComponent = () => {
    return (
        <div className="min-h-60 w-full flex items-center justify-center">
            <div className="flex items-center justify-center flex-col">
                <span className="loading loading-spinner loading-lg"></span>
                <div className="text-lg font-medium">Loading</div>
            </div>
        </div>
    );
};

const getColumns = (relationships, sources, navigate, users = []) => {
    return [
        {
            name: 'Tên khách hàng',
            render: (e) => {
                return e.name;
            },
        },
        {
            name: 'Mã KH',
            render: (e) => {
                return e.code;
            },
        },
        {
            name: 'Số điện thoại',
            render: (e) => {
                return e.phone;
            },
        },
        {
            name: 'Giới tính',
            render: (e) => {
                return Gender.fromContext(e.gender)?.label || 'Khác';
            },
        },
        {
            name: 'Email',
            render: (e) => {
                return e.email;
            },
        },
        {
            name: 'Ngày sinh',
            render: (e) => {
                return e.birthday
                    ? DateHelpers.formatDate(e.birthday, 'DD/MM/YYYY')
                    : '';
            },
        },
        {
            name: 'Người phụ trách',
            render: (e) => {
                const user = Arr.findById(
                    users,
                    e.assigned_user_id || e.assignedUserId
                );
                return user?.name || 'Không có dữ liệu';
            },
        },
        {
            name: 'Ngành nghề',
            render: (e) => {
                return e.job || '';
            },
        },
        {
            name: 'Người giới thiệu',
            render: (e) => {
                const user = Arr.findById(users, e.referrer_id || e.referrerId);
                return user?.name || 'Không có dữ liệu';
            },
        },
        {
            name: 'Nguồn khách hàng',
            render: (e) => {
                const source = Array.findById(
                    sources,
                    e.source_id || e.sourceId
                );
                return source ? source.name : 'Không có dữ liệu';
            },
        },
        {
            name: 'Người tạo',
            render: (e) => {
                const user = Arr.findById(users, e.creator_id || e.creatorId);
                return user?.name || 'Không có dữ liệu';
            },
        },
        {
            name: 'Ngày tạo',
            render: (e) => {
                return e.createdAt
                    ? DateHelpers.formatDate(e.createdAt, 'DD/MM/YYYY HH:mm')
                    : '';
            },
        },
        {
            name: 'Mối quan hệ khách hàng',
            render: (e) => {
                const relationship = Array.findById(
                    relationships,
                    e.relationship_id || e.relationshipId
                );
                return relationship? relationship.name : 'Không có dữ liệu';
            }
        },
        {
            name: 'Cập nhật lần cuối',
            render: (e) => {
                return e.updatedAt
                    ? DateHelpers.formatDate(e.updatedAt, 'DD/MM/YYYY HH:mm')
                    : '';
            },
        },
        {
            name: 'Thao tác',
            render: (e) => {
                const acl = e.acl;
                return (
                    <>
                        {acl?.edit || acl?.edit == null ? (
                            <button
                                className="btn btn-circle btn-text btn-sm"
                                aria-label="Action button"
                                onClick={() => {
                                    drawer.show({
                                        content: (
                                            <AccountForm
                                                url={`/api/account/edit/${e.id}`}
                                                title="Cập nhật mối quan hệ"
                                                value={e}
                                                submit="Cập nhật"
                                                relationships={relationships}
                                                callback={() => {
                                                    flash.success(
                                                        'Cập nhật thành công!'
                                                    );
                                                    navigate(0);
                                                }}
                                            />
                                        ),
                                    });
                                }}
                            >
                                <span className="icon-[tabler--pencil] size-5"></span>
                            </button>
                        ) : (
                            ''
                        )}
                        {acl?.delete || acl?.delete == null ? (
                            <button
                                className="btn btn-circle btn-text btn-sm"
                                aria-label="Action button"
                                onClick={() => {
                                    confirm_popup.showAlert(
                                        'Are you sure you want to delete this relationship? This action can not be undone.',
                                        (choose) => {
                                            if (choose) {
                                                const deleteRelationship =
                                                    async () => {
                                                        try {
                                                            loading.show();
                                                            const response =
                                                                await api.delete(
                                                                    `/api/account/delete/${e.id}`
                                                                );
                                                            flash.success(
                                                                'Xóa thành công!'
                                                            );
                                                            navigate(0);
                                                        } catch (err) {
                                                            error_popup.show(
                                                                'Xóa thất bại!'
                                                            );
                                                            console.error(err);
                                                        } finally {
                                                            loading.hide();
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
    const [relationships, setRelationships] = useState(Client.get('relationships'));
    const [sources, setSources] = useState(Client.get('sources'));
    const [users, setUsers] = useState(Client.get('users'));
    const [page, setPage] = useState(0);
    const [ipp, setIpp] = useState(10);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [data, setData] = setData([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/account/list', {
                params: {
                    page,
                    ipp,
                },
            });
            setData(response.data.data);
            setTotal(response.data.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const unsubscribe = Client.subscribe(() => {
            setRelationships(Client.get('relationships') || []);
            setSources(Client.get('sources') || []);
            setUsers(Client.get('users') || []);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        fetchData();
    });


    useEffect(() => {
        fetchData();
    }, [page, ipp]);
    return (
        <div className="account-list-page">
            <Header
                icon={<PiUsersThreeFill className="icon" />}
                title={'Khách hàng'}
                subtitle={'Danh sách khách hàng'}
            ></Header>
            <MainContent className="account-list-content">
            <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="text-lg font-semibold">
                                Danh sách khách hàng
                            </div>
                        </div>
                    </div>
                    {loading && <LoadingComponent />}
                    {!loading && data.length === 0 && <EmptyState />}
                    {!loading && data.length !== 0 && (
                        <PaginatedTable
                            className={'relationship-table bg-white'}
                            columns={getColumns(relationships, sources, navigate, users)}
                            data={relationships}
                            page={page}
                            total={total}
                            ipp={ipp}
                            onPageChange={(page) => {
                                setPage(page);
                            }}
                            onPageSizeChange={(pageSize) => {
                                setIpp(pageSize);
                                setPage(0);
                            }}
                        />
                    )}
                </div>
            </MainContent>
        </div>
    );
};

export default AccountList;
