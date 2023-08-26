import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { accessTokenAtom } from "services/recoil/auth";
import { socketGetAllLog, socketGetSettingLog, socketSetAllLog } from "services/socket/use.socket";

const LogBox = styled.textarea`
  border: 1px solid #0033ff;
  border-radius: 4px;
  padding: 1rem 2rem;
  margin-left: 1rem;
  width: 100%;
  height: 25rem;
  font-size: 1.35rem;
  resize: none;
  user-drag: none;
`;

const RecordLogBox = () => {
  const accessToken = useRecoilValue(accessTokenAtom);
  const [iniLog, setIniLog] = useState<string>("");
  const [additionalLogMessage, setAdditionalLogMessage] = useState<string>("");

  useEffect(() => { // 전체 로그 요청
    const fetchData = async () => {
      socketSetAllLog(accessToken);
      const initialLogMessage = await socketGetAllLog();
      setIniLog(initialLogMessage);
    };
    fetchData();
  }, []);

  useEffect(() => { // 추가 로그 요청
    const fetchAdditionalLog = async () => {
      const message = await socketGetSettingLog();
      setAdditionalLogMessage((prev) => (prev ? prev + '\n' + message : message));
    };
    fetchAdditionalLog();
  }, [additionalLogMessage]);

  return (
    <LogBox readOnly value={iniLog + additionalLogMessage}></LogBox>
  );
};

export default RecordLogBox;
