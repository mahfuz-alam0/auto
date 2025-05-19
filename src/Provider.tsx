import React, { ReactNode } from 'react';
import CommonProvider from './contexts/CommonContext';
import SocketProvider from './contexts/SocketContext';
import AuthProvider from './contexts/AuthContext';

interface ProviderProps {
  children: ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children }) => {
    return (
        <AuthProvider>
            <CommonProvider>
                <SocketProvider>
                    {children}
                </SocketProvider>
            </CommonProvider>
        </AuthProvider>
    );
};

export default Provider;
