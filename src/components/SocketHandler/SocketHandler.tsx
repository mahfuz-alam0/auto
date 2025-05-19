import { useEffect } from "react";
import { useSocket } from "../../contexts/SocketContext";
import { useCommon } from "../../contexts/CommonContext";

const SocketHandler: React.FC = () => {
    const socket = useSocket();
    const { handleSocketEvent } = useCommon();

    useEffect(() => {
        if (!socket) return;

        const events = ["newPrintJob", "setUpRemoved"];

        events.forEach((event) => socket.on(event, (data) => handleSocketEvent(event, data)));

        return () => events.forEach((event) => socket.off(event));
    }, [socket, handleSocketEvent]);

    return null;
};

export default SocketHandler;
