import {
    createBrowserRouter,
    Navigate,
    useLocation,
    useNavigate,
} from 'react-router-dom';
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
import AccountDetail from './views/account/AccountDetail';
import Feedback from './views/public/Feedback';
import PublicLayout from './layouts/PublicLayout';
import TaskPage from './views/TaskPage';
import AccountImport from './views/account/AccountImport';
import Users from './views/setting/Users';
import AddUser from './views/user/AddUser';
import EditUser from './views/user/EditUser';
import UserDetail from './views/user/UserDetail';
import Systems from './views/setting/Systems';
import NotFound from './views/NotFound';

function PrivateRoute({ element, roles = [] }) {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" />;
    }

    load();

    if (roles.length !== 0 && !roles.includes(user.role)) {
        flash.error('You do not have permission to access this page');
        return <Navigate to="/" />;
    }

    return element;
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: '', element: <Navigate to="/home" /> },
            { path: 'home', element: <PrivateRoute element={<Home />} /> },
            { path: 'me', element: <PrivateRoute element={<Me />} /> },
        ],
    },
    {
        path: '/account',
        element: <MainLayout />,
        children: [
            { path: '', element: <Navigate to="/account/list" /> },
            {
                path: 'list',
                element: <PrivateRoute element={<AccountList />} />,
            },
            {
                path: 'create',
                element: <PrivateRoute element={<AddAccount />} />,
            },
            {
                path: 'edit/:id',
                element: <PrivateRoute element={<EditAccount />} />,
            },
            {
                path: ':id',
                element: <PrivateRoute element={<AccountDetail />} />,
            },
            {
                path: 'import',
                element: <PrivateRoute element={<AccountImport />} />,
            },
        ],
    },
    {
        path: '/tasks',
        element: <MainLayout />,
        children: [
            { path: '', element: <PrivateRoute element={<TaskPage />} /> },
        ],
    },
    {
        path: '/settings',
        element: <MainLayout />,
        children: [
            { path: '', element: <PrivateRoute element={<Settings />} roles={[Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN]}  /> },
            {
                path: 'sources',
                element: <PrivateRoute element={<Sources />} roles={[Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN]}/>,
            },
            {
                path: 'relationships',
                element: <PrivateRoute element={<Relationships />} roles={[Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN]}/>,
            },
            { path: 'users', element: <PrivateRoute element={<Users />} roles={[Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN]} /> },
            {
                path: 'systems',
                element: (
                    <PrivateRoute
                        element={<Systems />}
                        roles={[Role.SUPER_ADMIN]}
                    />
                ),
            },
        ],
    },
    {
        path: '/login',
        element: <AuthLayout />,
        children: [{ path: '', element: <Login /> }],
    },
    {
        path: '/user',
        element: <MainLayout />,
        children: [
            { path: ':id', element: <PrivateRoute element={<UserDetail />} /> },
            { path: 'create', element: <PrivateRoute element={<AddUser />} /> },
            {
                path: 'edit/:id',
                element: <PrivateRoute element={<EditUser />} />,
            },
        ],
    },
    {
        path: '/public',
        element: <PublicLayout />,
        children: [{ path: 'feedback/:token', element: <Feedback /> }],
    },
    {
        path: '*',
        element: <NotFound />,
    }
]);

export default router;
