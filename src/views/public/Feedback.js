import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/Axios';
import loading from '../../utils/Loading';
import { Result } from 'antd';
import FeedbackForm from '../../components/feedback/FeedbackForm';

const Feedback = () => {
    const { token } = useParams();
    const [valid, setValid] = useState(null); // null = đang kiểm tra, true = hợp lệ, false = 404
    const [status, setStatus] = useState(false);
    useEffect(() => {
        const get = async () => {
            try {
                await api.get(`/api/public/feedback/${token}`);
                setValid(true);
            } catch (err) {
                setValid(false);
            }
        };
        get();
    }, [token]);

    useEffect(() => {
        if (valid == null) {
            loading.show();
        } else {
            loading.hide();
        }
    }, [valid]);

    if (valid == null) {
        return '';
    }

    if (valid == false) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                />
            </div>
        );
    }

    if (status) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Result
                    status="success"
                    title="Đánh giá thành công"
                    subTitle="Cảm ơn bạn vì đã dành thời gian để đánh giá."
                />
            </div>
        );
    }
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-[500px]">
                <h1 className="text-3xl font-medium pb-6">
                    Đánh giá của khách hàng
                </h1>
                <FeedbackForm
                    callback={() => {
                        setStatus(true);
                    }}
                    token={token}
                />
            </div>
        </div>
    );
};

export default Feedback;
