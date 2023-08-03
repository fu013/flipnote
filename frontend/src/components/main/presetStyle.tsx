import styled from "@emotion/styled";

export const PresetContainer = styled.div`
  margin: 0 1rem;
  & > p {
    font-size: 1.2rem;
  }
`;
export const PresetBox = styled.div`
  border: 1px solid #0033ff;
  padding: 1rem;
  border-radius: 4px;
  font-size: 1.2rem;
  font-family: "Noto Sans", sans-serif;
  overflow-y: scroll;
  min-width: 20rem;
  height: 22.1rem;
`;
export const PresetItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 5px;
  border-bottom: 1px solid #f1f1f1;
  cursor: pointer;
  &: hover {
    background: #f1f1f1;
  }
  &.active {
    background: #198df2;
    color: #fff;
  }
`;
export const PresetImg = styled.img`
  max-width: 20px;
`;
export const PresetTitle = styled.span`
  display: inline-block;
`;
export const PresetDelete = styled.button`
  display: inline-block;
  cursor: pointer;
`;
export const PresetAdd = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  & > input {
    margin-right: 5px;
    padding: 0 0.5rem;
  }
`;
export const PresetCharacterName = styled.span`
  font-weight: 900;
`;
