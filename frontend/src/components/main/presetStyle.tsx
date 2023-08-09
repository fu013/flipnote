import styled from "@emotion/styled";

export const PresetContainer = styled.div`
  margin: 0 1rem;
  & > p {
    font-size: 1.2rem;
  }
`;
export const PresetBox = styled.div`
  border: 3px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
  font-size: 1.2rem;
  font-family: "Noto Sans", sans-serif;
  overflow-y: auto;
  min-width: 33rem;
  height: 22.1rem;
  ::-webkit-scrollbar {
    width: 5px;
  }
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
export const PresetAddInput = styled.input``;
export const PresetDelBtn = styled.button`
  display: inline-block;
  cursor: pointer;
`;
export const PresetAddBtn = styled.button`
  display: inline-block;
  cursor: pointer;
`;
export const CharacterCard = styled.div`
  border: 5px solid #eee;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0 4rem;
  min-width: 20rem;
`;
export const CharacterName = styled.p`
  text-align: center;
  font-size: 1.5rem;
`;
export const CharacterLevel = styled.p`
  text-align: center;
  font-size: 1.35rem;
`;
export const CharacterContainer = styled.section`
  display: flex;
`;
export const CharacterImage = styled.img``;

export const ListCharImage = styled.img`
  max-width: 100%;
`;

export const ListItemContent = styled.div`
  display: flex;
`;

export const GridBox = styled.div``;

export const TypeTag = styled.span`
  display: inline-block;
  margin-right: 10px;
  padding: 2px 5px;
  background: #ddd;
  color: #333;
  font-size: 1.2rem !important;
  border-radius: 25px;
`;

export const ListItemOption = styled.div``;
