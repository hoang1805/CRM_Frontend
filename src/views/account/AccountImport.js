import React, { useState } from 'react';
import { PiUsersThreeFill } from 'react-icons/pi';
import MainContent from '../../components/page/MainContent';
import { Steps } from 'antd';
import AccountImportForm from './import/AccountImportForm';
import Header from '../../components/page/Header';
import AccountImportCheck from './import/AccountImportCheck';

const getStep1 = (current, loading) => {
    if (current == 0) {
        if (loading) {
            return 'process';
        }

        return null;
    }

    return 'finish';
};

const getStep2 = (current, loading) => {
    if (current < 1) {
        return 'wait';
    }

    if (current == 1) {
        if (loading) {
            return 'process';
        }

        return null;
    }

    return 'finish';
};

const getStep3 = (current, loading) => {
    if (current < 2) {
        return 'wait';
    }

    if (current == 2) {
        if (loading) {
            return 'process';
        }

        return null;
    }

    return 'finish';
};

const getItems = (current, loading, data, callback, onUpload, onImport) => {
    return [
        {
            title: 'Chọn tập tin (.xls, .xlsx)',
            description: 'Có thể tải lên tối đa 5000 khách hàng.',
            status: getStep1(current, loading),
        },
        {
            title: 'Kiểm tra tập tin',
            description: 'Thông tin khách hàng trong file',
            content: <div></div>,
            status: getStep2(current, loading),
        },
        {
            title: 'Hoàn thành',
            description: 'Tải lên thành công',
            content: <div></div>,
            status: getStep3(current, loading),
        },
    ];
};

const AccountImport = () => {
    const [current, setCurrent] = useState(0);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const onUpload = (data) => {
        setData(data);
        setCurrent(current + 1);
    };

    const onImport = () => {
        setCurrent(current + 1);
    }

    return (
        <div className="import-account-page">
            <Header
                icon={<PiUsersThreeFill className="icon" />}
                title={'Khách hàng'}
                subtitle={'Tải lên khách hàng'}
            ></Header>
            <MainContent className="import-account-content">
                <Steps
                    current={current}
                    items={getItems(
                        current,
                        loading,
                        data,
                        setLoading,
                        onUpload
                    )}
                />
                <div className="step-content">
                    {current == 0 && (
                        <AccountImportForm
                            data={data}
                            loading={loading}
                            callback={setLoading}
                            onUpload={onUpload}
                        />
                    )}
                    {current == 1 && <AccountImportCheck data={data} loading={loading} callback={setLoading} onImport={onImport} />}
                </div>
            </MainContent>
        </div>
    );
};

export default AccountImport;
