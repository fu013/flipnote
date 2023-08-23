import styled from "@emotion/styled";
import { useEffect } from "react";
import { useFetchLog } from "services/react-query/log.socket.query";
import {
  socketConnectOff,
  socketConnectOn,
  socketRequestLog,
  socketWriteLog,
} from "services/socket/log.socket";

socketConnectOn();

const LogBox = styled.div`
  border: 1px solid #0033ff;
  border-radius: 4px;
  padding: 1rem 2rem;
  margin-left: 1rem;
  width: 100%;
  height: 25rem;
  font-size: 1.2rem;
  overflow-y: auto;
`;

const RecordLogBox = () => {
  const { log, log_isLoading } = useFetchLog();

  // 컴포넌트 마운트 시 소켓 연결
  useEffect(() => {
    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      socketConnectOff();
    };
  }, []);

  return (
    <div>
      <LogBox>{JSON.stringify(log)}</LogBox>
      <button onClick={() => socketRequestLog()}>Request Log</button>
      <button onClick={() => socketWriteLog("Hello!")}>Write Log</button>
    </div>
  );
};

export default RecordLogBox;
