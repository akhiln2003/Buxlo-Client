import { useGetUser } from '@/hooks/useGetUser';
import React, { createContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const user = useGetUser();
    useEffect(() => {
        const newSocket = io('http://localhost:4004');


        setSocket(newSocket);

       if (socket) {
         socket.on('connect', () => {
            console.log('Socket connected:', socket.id);    
            socket.emit('online',  user?.id as string); // Replace 'userId' with the actual user ID
         });
       }

        return () => {
            if (socket) {
                socket.disconnect();
                console.log('Socket disconnected');
            }
        };
    }, [socket?.connected]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
