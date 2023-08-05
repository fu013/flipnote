// CharacterPreset.tsx
import { getImgURL } from "lib/getImgURL";
import { useState } from "react";
import { useCharacter_a } from "services/axios/character.axios";
import { CharacterData } from "services/interfaces/char.interface";
import {
  PresetAdd,
  PresetBox,
  PresetDelete,
  PresetTitle,
  PresetContainer,
  PresetCharacterName,
  CharacterCard,
  CharacterName,
  CharacterLevel,
  PresetItem, // Make sure to import PresetItem from the same file where it's defined
} from "./presetStyle";

const CharacterPreset = ({ charData }: { charData: CharacterData[] }) => {
  const [characterName, setCharacterName] = useState("");
  const [activeItem, setActiveItem] = useState(0); // Track the active item index
  const useCharacterA = useCharacter_a();

  const handleSetChar = async () => {
    await useCharacterA.setCharacter(characterName);
  };

  const handleItemClick = (index: number) => {
    setActiveItem(index); // Set the clicked item as active
  };

  return (
    <section style={{ display: "flex" }}>
      <CharacterCard>
        {/* Display information of the active item */}
        <img src={charData[activeItem].chImage} alt="character Profile Image" />
        <CharacterName>{charData[activeItem].chName}</CharacterName>
        <CharacterLevel>{charData[activeItem].chLevel} </CharacterLevel>
      </CharacterCard>
      <PresetContainer>
        <PresetAdd>
          <input
            type="text"
            placeholder="캐릭터 명"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
          />
          <button type="button" onClick={() => handleSetChar()}>
            ⬇
          </button>
        </PresetAdd>
        <PresetBox>
          {charData.map((item: CharacterData, index: number) => (
            <PresetItem
              key={item.chName}
              onClick={() => handleItemClick(index)}
              className={activeItem === index ? "active" : ""}
            >
              <PresetTitle>
                {item.chLevel}
                <PresetCharacterName>{item.chName}</PresetCharacterName>
              </PresetTitle>
              <PresetDelete>제거</PresetDelete>
            </PresetItem>
          ))}
        </PresetBox>
      </PresetContainer>
    </section>
  );
};

export default CharacterPreset;
