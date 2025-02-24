import { RouterProvider, useLocation } from 'react-router-dom';
import router from './routes';
import './styles/app.scss';
import AuthContext, { AuthProvider } from './context/AuthContext';
import loading from './utils/Loading';
import drawer from './utils/Drawer';
import { useContext, useEffect } from 'react';
import { setAuthInstance } from './utils/Axios';

function App() {
    const auth = useContext(AuthContext);
    useEffect(() => {
        setAuthInstance(auth);
    }, [auth]);
    return (
        <div className="App">
            <AuthProvider>
                <RouterProvider router={router}>
                </RouterProvider>
            </AuthProvider>
            {loading.useLoading()}
            {drawer.useDrawer()}
        </div>
    );
}

export default App;
