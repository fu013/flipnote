// CharacterPreset.tsx
import { getImgURL } from "lib/getImgURL";
import { useState } from "react";
import { CharacterData } from "services/interfaces/char.interface";
import {
  PresetAdd,
  PresetBox,
  PresetDelBtn,
  PresetTitle,
  PresetContainer,
  PresetCharacterName,
  CharacterCard,
  CharacterName,
  CharacterLevel,
  PresetItem,
  CharacterContainer,
  CharacterImage,
  PresetAddInput,
  PresetAddBtn,
  PresetImg,
  ListCharImage,
} from "./presetStyle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFetchChar } from "services/react-query/character.query";
import { useChar_h } from "services/hooks/char.hook";
import styled from "@emotion/styled";

const StyledListItem = styled(ListItem)`
  &.active {
    background: #198df2;
    color: #fff;
  }
`;
const StyledAvatar = styled(Avatar)`
  background: #f1f1f1;
`;

const CharacterPreset = () => {
  const { char, char_isLoading } = useFetchChar();
  const [characterName, setCharacterName] = useState("");
  const [activeItem, setActiveItem] = useState(0);
  const useCharH = useChar_h();
  const updateCharMutation = useCharH.useUpdateChar();
  const deleteCharMutation = useCharH.useDeleteChar();

  const handleSetChar = async () => {
    await updateCharMutation.mutateAsync(characterName);
  };

  const handleDelChar = async (targetCharacterName: string) => {
    await deleteCharMutation.mutateAsync(targetCharacterName);
  };

  const handleItemClick = (index: number) => {
    setActiveItem(index);
  };

  return (
    <CharacterContainer>
      <CharacterCard>
        <CharacterImage
          src={char[activeItem]?.chImage || getImgURL("default.png")}
          alt="character Profile Image"
        />
        <CharacterName>{char[activeItem]?.chName || "미생성"}</CharacterName>
        <CharacterLevel>{char[activeItem]?.chLevel || "Lv. 1"} </CharacterLevel>
      </CharacterCard>
      <PresetContainer>
        <PresetAdd>
          <PresetAddInput
            type="text"
            placeholder="캐릭터 명"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
          />
          <PresetAddBtn type="button" onClick={() => handleSetChar()}>
            ⬇
          </PresetAddBtn>
        </PresetAdd>
        <PresetBox>
          <List>
            {char.map((item: CharacterData, index: number) => (
              <StyledListItem
                key={item.chName}
                className={activeItem === index ? "active" : ""}
                onClick={() => handleItemClick(index)}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon onClick={() => handleDelChar(item.chName)} />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <StyledAvatar>
                    <ListCharImage src={item.chImage} alt="없음" />
                  </StyledAvatar>
                </ListItemAvatar>
                {item.chLevel}
                <ListItemText primary={item.chName} />
              </StyledListItem>
            ))}
          </List>
        </PresetBox>
      </PresetContainer>
    </CharacterContainer>
  );
};

export default CharacterPreset;
