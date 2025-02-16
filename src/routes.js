import { createBrowserRouter, Navigate, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './views/Login';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import Home from './views/Home';
import Me from './views/Me';
import AccountList from './views/account/AccountList';
import load from './utils/Loader';
import AddAccount from './views/account/AddAccount';
import Settings from './views/setting/Settings';
import Role from './utils/Role';
import flash from './utils/Flash';
import Sources from './views/setting/Sources';
import Relationships from './views/setting/Relationships';
import EditAccount from './views/account/EditAccount';

function PrivateRoute({ element, roles = [] }) {
    const { user } = useContext(AuthContext);
  
    if (!user) {
        return <Navigate to="/login" />;
    }

    load();

    if ((roles.length === 0 || roles.includes(user.role)) && element) {
        return element;
    }

    if (roles.length !== 0 && !roles.includes(user.role)) {
        flash.error('You do not have permission to access this page');
    }
  
    return <Navigate to="/" />;
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {path: "", element: <Navigate to='/home' />},
            {path: "home", element: <PrivateRoute element={<Home />} />},
            {path: "me", element: <PrivateRoute element={<Me />} />},
        ],
    },
    {
        path: '/account',
        element: <MainLayout />,
        children: [
            {path: '', element: <Navigate to='/account/list' /> },
            {path: 'list', element: <PrivateRoute element={<AccountList />} />},
            {path: 'create', element: <PrivateRoute element={<AddAccount />} />},
            {path: 'edit/:id', element: <PrivateRoute element={<EditAccount />} />}
        ],
    }, 
    {
        path: '/settings',
        element: <MainLayout />,
        children: [
            { path: '', element: <PrivateRoute element={<Settings />} />},
            { path: 'sources', element: <PrivateRoute element={<Sources />} />},
            { path: 'relationships', element: <PrivateRoute element={<Relationships />} />}
        ],
    },
    {
        path: '/login',
        element: <AuthLayout />,
        children: [{ path: '', element: <Login /> }],
    },
]);

export default router;
