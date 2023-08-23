import { io } from "socket.io-client";
import { SERVER_URL } from "config/constants.config";

const socket = io(SERVER_URL, {
  path: "/logActive",
});

export const socketConnectOn = () => {
  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
  });
};
export const socketConnectOff = () => {
  socket.disconnect();
};

export const socketGetLogContent = () => {
  socket.on("logContent", (data) => {
    return data;
  });
};

export const socketRequestLog = () => {
  socket.emit("requestLog");
};

export const socketWriteLog = (logMessage: string | number) => {
  socket.emit("writeLog", logMessage);
};
