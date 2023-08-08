import React from "react";
import { getImgURL } from "lib/getImgURL";
import {
  PresetContainer,
  PresetAdd,
  PresetBox,
  PresetDelBtn,
  PresetItem,
  PresetTitle,
  PresetImg,
  PresetAddInput,
  PresetAddBtn,
} from "./presetStyle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";

function generate(element: React.ReactElement) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

const TodoPreset = () => {
  return (
    <PresetContainer>
      <PresetAdd>
        <PresetAddInput type="text" placeholder="프리셋 명" />
        <PresetAddBtn type="button">⬇</PresetAddBtn>
      </PresetAdd>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ background: "#ddd" }}>고정</div>
        <div style={{ background: "#f5f5f5" }}>개인</div>
        <div style={{ background: "#f5f5f5" }}>로그</div>
      </div>
      <PresetBox>
        <PresetItem>
          <PresetImg src={getImgURL("image042.png")}></PresetImg>
          <PresetTitle>소멸의 여로 심볼</PresetTitle>
          <PresetDelBtn>제거</PresetDelBtn>
        </PresetItem>
        <PresetItem>
          <PresetImg src={getImgURL("image044.png")}></PresetImg>
          <PresetTitle>츄츄 심볼</PresetTitle>
          <PresetDelBtn>제거</PresetDelBtn>
        </PresetItem>
        <PresetItem>
          <PresetImg src={getImgURL("image046.png")}></PresetImg>
          <PresetTitle>레헬른 심볼</PresetTitle>
          <PresetDelBtn>제거</PresetDelBtn>
        </PresetItem>
        <PresetItem>
          <PresetImg src={getImgURL("image048.png")}></PresetImg>
          <PresetTitle>아르카나 심볼</PresetTitle>
          <PresetDelBtn>제거</PresetDelBtn>
        </PresetItem>
        <PresetItem>
          <PresetImg src={getImgURL("image050.png")}></PresetImg>
          <PresetTitle>모라스 심볼</PresetTitle>
          <PresetDelBtn>제거</PresetDelBtn>
        </PresetItem>
        <PresetItem>
          <PresetImg src={getImgURL("image052.png")}></PresetImg>
          <PresetTitle>에스페라 심볼</PresetTitle>
          <PresetDelBtn>제거</PresetDelBtn>
        </PresetItem>
        <List>
          {generate(
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <PresetImg src={getImgURL("image052.png")}></PresetImg>
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Single-line item" />
            </ListItem>
          )}
        </List>
      </PresetBox>
    </PresetContainer>
  );
};

export default TodoPreset;
