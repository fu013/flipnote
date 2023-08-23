import { useQuery } from "@tanstack/react-query";
import { socketRequestLog } from "../socket/log.socket";

const QUERY_KEY = {
  log: "log",
};

// 캐싱 :: 로그 관리
export const useFetchLog = () => {
  const { data, isLoading } = useQuery([QUERY_KEY.log], async () => {
    const logData = await socketRequestLog(); // Wait for the socket request to complete
    return logData;
  });

  if (typeof data === "undefined") {
    throw new Error("데이터를 불러올 수 없습니다.");
  }

  return {
    log: data,
    log_isLoading: isLoading,
  };
};
