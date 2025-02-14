import { RouterProvider, useLocation } from 'react-router-dom';
import router from './routes';
import './styles/app.scss';
import { AuthProvider } from './context/AuthContext';
import loading from './utils/Loading';
import popup from './utils/popup/Popup';
import { useEffect } from 'react';
import FlyonInitializer from './components/FlyonInitializer';
import flash from './utils/Flash';
import drawer from './utils/Drawer';

function App() {
    return (
        <div className="App">
            <AuthProvider>
                <RouterProvider router={router}>
                    <FlyonInitializer />
                </RouterProvider>
            </AuthProvider>
            {loading.useLoading()}
            {popup.usePopup()}
            {flash.useFlash()}
            {drawer.useDrawer()}
        </div>
    );
}

export default App;
