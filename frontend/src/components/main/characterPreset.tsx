// CharacterPreset.tsx
import { getImgURL } from "lib/getImgURL";
import { useState, useEffect } from "react";
import { CharacterData } from "services/interfaces/char.interface";
import {
  PresetAdd,
  PresetBox,
  PresetContainer,
  CharacterCard,
  CharacterName,
  CharacterLevel,
  CharacterContainer,
  CharacterImage,
  PresetAddInput,
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
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { charActiveIndexAtom, charActiveNameAtom } from "services/recoil/charActive";
import { useRecoilState } from "recoil";

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
  const [activeIndex, setActiveIndex] = useRecoilState(charActiveIndexAtom);
  const [activeName, setActiveName] = useRecoilState(charActiveNameAtom);
  const useCharH = useChar_h();
  const updateCharMutation = useCharH.useUpdateChar();
  const deleteCharMutation = useCharH.useDeleteChar();

  useEffect(() => {
    if (!activeIndex || !activeName) {
      if (char.length > 0) {
        setActiveIndex(0);
        setActiveName(char[0].chName);
      }
    }
  }, []);

  const handleSetChar = async () => {
    await updateCharMutation.mutateAsync(characterName);
  };

  const handleDelChar = async (targetCharacterName: string) => {
    await deleteCharMutation.mutateAsync(targetCharacterName);
  };

  const handleItemClick = (index: number, name: string) => {
    setActiveIndex(index);
    setActiveName(name);
  };

  return (
    <CharacterContainer>
      <CharacterCard>
        <CharacterImage
          src={char[activeIndex]?.chImage || getImgURL("default.png")}
          alt="character Profile Image"
        />
        <CharacterName>{char[activeIndex]?.chName || "미생성"}</CharacterName>
        <CharacterLevel>{char[activeIndex]?.chLevel || "Lv. 1"} </CharacterLevel>
      </CharacterCard>
      <PresetContainer>
        <PresetAdd>
          <PresetAddInput
            type="text"
            placeholder="캐릭터 명"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
          />
          <Button
            sx={{ minWidth: "4rem !important" }}
            onClick={() => handleSetChar()}
            variant="contained"
            endIcon={
              <SendIcon
                sx={{
                  "& span": {
                    marginLeft: "0 !important",
                  },
                }}
              />
            }
          ></Button>
        </PresetAdd>
        <PresetBox>
          <List>
            {char.map((item: CharacterData, index: number) => (
              <StyledListItem
                key={item.chName}
                className={activeIndex === index ? "active" : ""}
                onClick={() => handleItemClick(index, item.chName)}
                secondaryAction={
                  <IconButton onClick={() => handleDelChar(item.chName)} edge="end" aria-label="delete">
                    <DeleteIcon />
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
