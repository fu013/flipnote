/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { SERVER_URL } from "config/constants.config";
import { useRecoilValue } from "recoil";
import { accessTokenAtom } from "services/recoil/auth";

const socket = io(SERVER_URL, {
  path: "/logActive",
});

const QUERY_KEY = {
  log: "log",
};

// 로그 소켓 커스텀 훅 :: JWT 인증을 통해, 현재 접속한 아이디로 요청하는 것이 아닌 경우, 로그를 소켓 통신으로 무단으로 읽고 쓸 수 없게 설계
export const useSocket_h = () => {
  const accessToken = useRecoilValue(accessTokenAtom);
  const isSocketConnected = socket.connected; // 소켓 연결 상태 확인
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isSocketConnected) {
      socket.io.opts.query = { token: accessToken };
      socket.connect();
      queryClient.invalidateQueries([QUERY_KEY.log]);
    }
    return () => {
      if (isSocketConnected) {
        socket.disconnect();
      }
    };
  }, [accessToken, isSocketConnected]);

  const socketRequestLog = () => {
    socket.emit("requestLog");
    queryClient.invalidateQueries([QUERY_KEY.log]);
    return new Promise((resolve) => {
      socket.once("logContent", (data) => {
        resolve(data);
      });
    });
  };

  const socketWriteLog = (logMessage: string | number) => {
    socket.emit("writeLog", logMessage);
  };
  const { data, isLoading } = useQuery([QUERY_KEY.log], async () => {
    const logData = await socketRequestLog();
    return logData;
  });

  if (typeof data === "undefined") {
    throw new Error("데이터를 불러올 수 없습니다.");
  }

  return {
    log: data,
    log_isLoading: isLoading,
    socketRequestLog,
    socketWriteLog,
  };
};
