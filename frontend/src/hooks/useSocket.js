import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Initialize socket connection
        const socketInstance = io(SOCKET_URL);
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('Connected to socket server:', socketInstance.id);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return socket;
};
