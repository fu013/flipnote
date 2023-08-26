import { io } from "socket.io-client";
import { SERVER_URL } from "config/constants.config";

const socket = io(SERVER_URL, {
  path: "/logActive",
});

export const socketConnect = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const socketDisconnect = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const socketSetClientLog = (data: { message: string; token: string }) => {
  socket.emit("serverLogMessage", data);
};

export const socketSetAllLog = (token: string) => {
  socket.emit("serverExportAllLogs", token);
};

export const socketGetAllLog = () => {
  return new Promise<string>((resolve) => {
    socket.on("logAll", (data) => {
      resolve(data);
    });
  });
};

export const socketGetSettingLog = () => {
  return new Promise<string>((resolve) => {
    socket.on("clientLogMessage", (data) => {
      resolve(data);
    });
  });
};