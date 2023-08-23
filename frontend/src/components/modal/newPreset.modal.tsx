/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Button, Checkbox, ListItem, Modal, Paper } from "@mui/material";
import { nowDate } from "lib/getNowDate";
import { useRecoilState, useRecoilValue } from "recoil";
import { charActiveNameAtom } from "services/recoil/charActive";
import { userInfoAtom } from "services/recoil/auth";
import { presetTypeAtom } from "services/recoil/presetType";
import {
  ListItemInfo,
  changeListItemInfo,
} from "services/interfaces/todo.interface";
import { v4 as uuidv4 } from "uuid";
import { useTodo_h } from "services/hooks/todo.hook";
import styled from "@emotion/styled";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { logAtom } from "services/recoil/logAtom";
import { ListCharImage } from "components/main/presetStyle";

const StyledModal = styled(Modal)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0 !important;
  outline: 0 !important;
`;

const ModalPaper = styled(Paper)`
  width: 60rem;
  height: 70rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  justify-content: space-between;
  padding: 2rem 3rem;
`;

const StyledListItem = styled(ListItem)`
  border-bottom: 1px solid #eee;
  &.active {
    background: #198df2;
    color: #fff;
  }
`;

const StyledAvatar = styled(Avatar)`
  background: #f1f1f1;
`;

const PresetInput = styled.input`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0 5px;
  outline: 0;
`;

const SimpleModal = ({
  open,
  onClose,
  todo,
  todo_c,
}: {
  open: any;
  onClose: any;
  todo: ListItemInfo[];
  todo_c: ListItemInfo[];
}) => {
  const [newPresetTitle, setNewPresetTitle] = useState("");
  const charName = useRecoilValue(charActiveNameAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  const presetType = useRecoilValue(presetTypeAtom);
  const [newPreset, setNewPreset] = useState<changeListItemInfo[]>([]);
  const useTodoH = useTodo_h();
  const useNewPreset = useTodoH.useNewPreset();
  const allTodo = [...todo, ...todo_c].map((item) => ({
    ...item,
    isDelete: false,
  }));
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    setNewPreset(allTodo);
  }, [todo, todo_c]);

  const handleAddPreset = () => {
    if (newPresetTitle.trim() === "") {
      return;
    }
    const newPresetItem: changeListItemInfo = {
      orderNo: newPreset.length,
      todoId: uuidv4(),
      todoName: newPresetTitle,
      todoType: presetType.toString(),
      todoImage: "",
      mbId: userInfo.mbId,
      chName: charName,
      createdDate: nowDate(),
      isDelete: false,
    };
    setNewPreset((prevState) => [...prevState, newPresetItem]);
    setNewPresetTitle("");
  };

  const handleClose = () => {
    setNewPreset(allTodo);
    onClose();
  };

  const handleToggle = (todoId: string) => () => {
    const currentIndex = checked.indexOf(todoId);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(todoId);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    const updatedPreset = newPreset.map((item) => {
      if (item.todoId === todoId) {
        return {
          ...item,
          isDelete: true,
        };
      }
      return item;
    });
    setNewPreset(updatedPreset);
    setChecked(newChecked);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      handleAddPreset();
    }
  };

  return (
    <StyledModal open={open} onClose={onClose}>
      <ModalPaper>
        <div style={{ display: "flex" }}>
          <PresetInput
            type="text"
            value={newPresetTitle}
            onChange={(e) => setNewPresetTitle(e.target.value)}
            placeholder="새 프리셋 추가(enter)"
            onKeyDown={(e: any) => handleKeyPress(e)}
          />
          <Button
            sx={{ marginLeft: ".5rem" }}
            variant="contained"
            onClick={() => handleAddPreset()}
          >
            추가
          </Button>
        </div>
        <List sx={{ width: "100%", height: "57.5rem", overflowY: "auto" }}>
          {newPreset.map((item, index) =>
            !item.isDelete ? (
              <StyledListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" onClick={handleToggle(item.todoId)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <StyledAvatar>
                    {/* <ListCharImage src={item.chImage} alt="없음" /> */}
                  </StyledAvatar>
                </ListItemAvatar>
                <ListItemText primary={item.todoName} />
              </StyledListItem>
            ) : null
          )}
        </List>
        <div style={{ display: "flex" }}>
          <Button
            sx={{ marginLeft: ".5rem" }}
            variant="contained"
            onClick={() => useNewPreset.mutateAsync(newPreset)}
          >
            저장
          </Button>
          <Button
            sx={{ marginLeft: ".5rem" }}
            variant="outlined"
            onClick={handleClose}
          >
            닫기
          </Button>
        </div>
      </ModalPaper>
    </StyledModal>
  );
};

export default SimpleModal;
