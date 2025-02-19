import React, { useEffect, useState } from 'react';
import Header from '../../components/page/Header';
import { RiSettings3Fill } from 'react-icons/ri';
import MainContent from '../../components/page/MainContent';
import api from '../../utils/Axios';
import drawer from '../../utils/Drawer';
import SourceDrawerForm from '../../components/sources/SourceDrawerForm';
import Table from '../../components/table/Table';
import '../../styles/views/setting/sources.scss';
import { useNavigate } from 'react-router-dom';
import flash from '../../utils/Flash';
import confirm_popup from '../../utils/popup/ConfirmPopup';
import error_popup from '../../utils/popup/ErrorPopup';
import loading from '../../utils/Loading';

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


const getColumns = (sources, user, navigate) => {
    return [
        {
            name: 'Tên nguồn khách hàng',
            render: (e) => {
                return e.name;
            },
        },
        {
            name: 'Mã',
            render: (e) => {
                return e.code;
            },
        },
        {
            name: 'Nguồn khách hàng cha',
            render: (e) => {
                if (!e.parent_id) return '';
                const parent = sources.find((elem) => elem.id === e.parent_id);
                return parent ? parent.name : ''; // Lấy 'name' hoặc trả về rỗng nếu không tìm thấy
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
                                    confirm_popup.showAlert('Are you sure you want to delete this source? This action can not be undone.', (choose) => {
                                        if (choose) {
                                            const deleteSource = async() => {
                                                try {
                                                    loading.show();
                                                    const response = await api.delete(`/api/source/delete/${e.id}`);
                                                    flash.success('Xóa thành công!');
                                                    navigate(0);
                                                } catch (err) {
                                                    error_popup.show('Xóa thất bại!');
                                                    console.error(err);
                                                } finally {
                                                    loading.hide();
                                                }
                                            };
                                            deleteSource();
                                        }
                                    });
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

const Sources = () => {
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState('');
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

    const handleKeyDown = (event) => {
        if (loading) {
            return ;
        }

        if (event.key === 'Enter') {
            const loadSources = async() => {
                if (!input) {
                    return ;
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
            }
    
            loadSources();
        }
    }

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
                            <input
                                type="text"
                                placeholder="Tìm kiếm nguồn khách hàng"
                                className="input w-full max-w-xs"
                                aria-label="Tìm kiếm nguồn khách hàng"
                                onChange={(e) => setInput(e.target.value)}
                                value={input}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <button
                            className="btn bg-[#233F80] text-white hover:bg-[#233F80]/90"
                            onClick={() =>
                                drawer.show({
                                    content: (
                                        <SourceDrawerForm
                                            url="/api/source/create"
                                            title="Thêm nguồn khách hàng"
                                            sources={sources}
                                            submit="Thêm mới"
                                            callback={() => {
                                                flash.success('Thêm nguồn khách hàng thành công!');
                                                navigate(0);
                                            }}
                                        />
                                    ),
                                })
                            }
                        >
                            Thêm mới
                        </button>
                    </div>
                    {loading && <LoadingComponent />}
                    {!loading && sources.length === 0 && <EmptyState />}
                    {!loading && sources.length !== 0 && (
                        <Table
                            className={'source-table bg-white'}
                            columns={getColumns(sources, null, navigate)}
                            data={sources}
                        />
                    )}
                </div>
            </MainContent>
        </div>
    );
};

export default Sources;
