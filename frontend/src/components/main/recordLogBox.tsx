import styled from "@emotion/styled";
import { useRecoilValue } from "recoil";
import { logAtom } from "services/recoil/logAtom";

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
  const logs = useRecoilValue(logAtom);
  return (
    <LogBox>
      {logs.map((log, index) => (
        <p key={index}>{log}</p>
      ))}
    </LogBox>
  );
};

export default RecordLogBox;
