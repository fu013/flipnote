import styled from "@emotion/styled";

const RecordLogBox = () => {
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
  return (
    <LogBox>
      <p>＃ [삔제] : 2022-08-02 일간 할일 완료 [클릭시 목록 상세보기]</p>
      <p>＃ [삔제, 삔쉘] : 2022-08-01 주간 할일 완료 [클릭시 목록 상세보기]</p>
    </LogBox>
  );
};

export default RecordLogBox;
