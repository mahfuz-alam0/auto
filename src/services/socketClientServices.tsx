import { io, Socket } from "socket.io-client";

const socketURL =`${import.meta.env.VITE_PUBLIC_BASE_URL}/hclient-app-facing`;

export const connectSocket = (authToken: string): Socket | null => {
    if (!authToken) {
        console.error("❌ Auth token is required to connect to the socket");
        return null;
    }

    const socket = io(`${socketURL}?auth=${authToken}`, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
    });

    socket.onAny((eventName, ...args) => {
        console.log(`📢 Socket Event: ${eventName}`, args);
    });

    socket.on("connect", () => {
        console.log("✅ Connected to socket server");
    });

    socket.on("disconnect", (reason) => {
        console.warn("⚠️ Disconnected from socket:", reason);
    });

    socket.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error);
    });

    return socket;
};
