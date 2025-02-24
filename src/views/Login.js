import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import loading from '../utils/Loading';
import api from '../utils/Axios';
import '../styles/views/login.scss';
import AuthContext from '../context/AuthContext';
import flash from '../utils/Flash';
import popup from '../utils/popup/Popup';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const auth_context = useContext(AuthContext);
    const navigate = useNavigate(); // Hook để chuyển hướng



    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn form reload trang
        loading.show();

        // Kiểm tra validation
        if (!username || !password) {
            popup.error("Username or password is empty. Please try again.");
            loading.hide();
            return;
        }

        // Gửi API đăng nhập (giả lập)
        try {
            const response = await api.post('/api/login', {username, password});
            console.log(response);
            const user = response.data.user;
            auth_context.login(user);
            flash.success('Login successful');
            navigate('/home');
        } catch (error) {
            popup.error(error.response?.data?.message || error.message || 'Có lỗi xảy ra');
        } finally {
            loading.hide();
        }
    };

    useEffect(() => {
        if (auth_context.user) {
            // navigate('/home'); // Nếu đã đăng nhập, chuyển hướng đến trang home nếu còn đăng nhập
            (async() => {
                try {
                    loading.show();
                    const response = await api.get('/api/user');
                    const data = response.data;
                    const user = data.user;
                    if (user.id === auth_context.user.id) {
                        auth_context.login(user);
                        flash.success('Login successful');
                        navigate('/home');
                    } else {
                        auth_context.logout();
                        flash.error('Đăng nhập thất bại');
                        navigate(0);
                    }
                } catch (err) {
                    console.error(err);
                    auth_context.logout();
                    flash.error('Đăng nhập thất bại');
                    // navigate(0);
                } finally {
                    loading.hide();
                }
                
            })();
        }
    }, [])


    return (
        <div className="login-page">
            <h1 className="title">Đăng nhập</h1>
            <div className="form-group">
                <label htmlFor="username">Tên đăng nhập</label>
                <input id="username" name="username" type="text" placeholder="Nhập tài khoản" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input id="password" name="password" type="password" placeholder="Nhập mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="forgot-password">
                <Link to='/forget.password'>Quên mật khẩu</Link>
            </div>
            <button className="login-button" onClick={handleSubmit}>Đăng nhập</button>
        </div>
    );
};

export default Login;