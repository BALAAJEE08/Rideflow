import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!token || !user) return undefined;
    const connection = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", { transports: ["websocket"] });
    connection.emit("join", { userId: user.id, role: user.role });
    ["ride:requested", "ride:accepted", "ride:status", "ride:cancelled", "driver:availability"].forEach((event) => {
      connection.on(event, (payload) => setNotifications((current) => [{ event, payload, at: new Date().toISOString() }, ...current].slice(0, 12)));
    });
    setSocket(connection);
    return () => connection.disconnect();
  }, [token, user]);

  const value = useMemo(() => ({ socket, notifications }), [socket, notifications]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
