import { RouterProvider, useLocation } from 'react-router-dom';
import router from './routes';
import './styles/app.scss';
import { AuthProvider } from './context/AuthContext';
import loading from './utils/Loading';
import drawer from './utils/Drawer';

function App() {
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
