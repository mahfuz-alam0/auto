import React, { useEffect } from 'react';
import SocketHandler from '../components/SocketHandler/SocketHandler';
import { useCommon } from '../contexts/CommonContext';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const MainLayout: React.FC = () => {
    const { user } = useAuth();
    const { fetchPrinters } = useCommon();

    useEffect(() => {
        fetchPrinters()
    }, [user])

    return (
        <>
            <Outlet />
            <SocketHandler />
        </>
    );
};

export default MainLayout;
