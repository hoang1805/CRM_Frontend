import { Button, Result } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className='h-[100vh] flex items-center justify-center'>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary" onClick={() => navigate('/home')}>Back Home</Button>}
            />
        </div>
    );
};

export default NotFound;
