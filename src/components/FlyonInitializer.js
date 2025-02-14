import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import 'flyonui/flyonui';
const FlyonInitializer = () => {
    const location = useLocation();

    useEffect(() => {
        const loadFlyonui = async () => {
            window.HSStaticMethods.autoInit();
        };
        loadFlyonui();
    }, [location.pathname]);

  return null;
};

export default FlyonInitializer;