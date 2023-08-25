import styled from "@emotion/styled";
import { useSocket_h } from "services/socket/log.socket.union.hook";

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
  const useSocketH = useSocket_h();
  const log = useSocketH.log;

  return (
    <div>
      <LogBox>{JSON.stringify(log)}</LogBox>
      <button onClick={() => useSocketH.socketRequestLog()}>Request Log</button>
      <button onClick={() => useSocketH.socketWriteLog("Hello!")}>
        Write Log
      </button>
    </div>
  );
};

export default RecordLogBox;
