import customToast from "lib/customToast";
import { useEffect, useState } from "react";
import { useToast } from "react-toastify";
import { useCharacter_a } from "services/axios/character.axios";
import {
  PresetAdd,
  PresetBox,
  PresetDelete,
  PresetItem,
  PresetTitle,
  PresetContainer,
  PresetCharacterName,
} from "./presetStyle";

const CharacterPreset = () => {
  const [characterName, setCharacterName] = useState("");
  const useCharacterA = useCharacter_a();
  useEffect(() => {

  }, []);
  const handleSetChar = async () => {
    await useCharacterA.setCharacter(characterName);
  };
  return (
    <PresetContainer>
      <PresetAdd>
        <input
          type="text"
          placeholder="캐릭터 명"
          value={characterName} // 입력값을 상태와 바인딩
          onChange={(e) => setCharacterName(e.target.value)} // 입력값 변경 시 상태 업데이트
        />
        <button type="button" onClick={() => handleSetChar()}>⬇</button>
      </PresetAdd>
      <PresetBox>
        {/* <PresetItem>
          <PresetTitle>
            Lv.278 <PresetCharacterName>삔제</PresetCharacterName>
          </PresetTitle>
          <PresetDelete>제거</PresetDelete>
        </PresetItem> */}
      </PresetBox>
    </PresetContainer>
  );
}

export default CharacterPreset;