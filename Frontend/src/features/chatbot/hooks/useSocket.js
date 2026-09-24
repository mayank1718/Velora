import { useEffect } from "react";
import socket from "../services/socket.service";

const useSocket = () => {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
