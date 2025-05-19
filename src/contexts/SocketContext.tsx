import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { connectSocket } from "../services/socketClientServices";
import { Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!user?.accessToken) return;

        const socketInstance = connectSocket(user.accessToken);
        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
            console.log("🔌 Socket disconnected on unmount");
        };
    }, [user?.accessToken]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;
