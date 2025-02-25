import { RouterProvider } from 'react-router-dom';
import router from './routes';
import './styles/app.scss';
import AuthContext, { AuthProvider } from './context/AuthContext';
import loading from './utils/Loading';
import drawer from './utils/Drawer';
import { useContext, useEffect } from 'react';
import { setAuthInstance } from './utils/Axios';

function App() {
    return (
        <AuthProvider>
            <MainApp />
        </AuthProvider>
    );
}

function MainApp() {
    const auth = useContext(AuthContext);

    useEffect(() => {
        if (auth) {
            setAuthInstance(auth);
        }
    }, [auth]);
    
    return (
        <div className="App">
            <RouterProvider router={router} />
            {loading.useLoading()}
            {drawer.useDrawer()}
        </div>
    );
}

export default App;
