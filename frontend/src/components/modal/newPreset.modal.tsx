import { useState, useEffect } from "react";
import { Button, Modal, Paper } from '@mui/material';
import { nowDate } from "lib/getNowDate";
import { useRecoilValue } from "recoil";
import { charActiveNameAtom } from "services/recoil/charActive";
import { userInfoAtom } from "services/recoil/auth";
import { presetTypeAtom } from "services/recoil/presetType";
import { ListItemInfo } from "services/interfaces/todo.interface";
import { leftState } from "services/recoil/atom";
import { v4 as uuidv4 } from "uuid";
import { useTodo_h } from "services/hooks/todo.hook";
import styled from '@emotion/styled';

const StyledModal = styled(Modal)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Adjust opacity (0.5 in this example) */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalPaper = styled(Paper)`
  padding: 16px;
  width: 500px;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  justify-content: space-between;
`;

const PresetList = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
`;

const PresetItem = styled.div`
  margin-bottom: 8px;
`;

const SimpleModal = ({ open, onClose }: any) => {
  const [newPresetTitle, setNewPresetTitle] = useState("");
  const charName = useRecoilValue(charActiveNameAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  const presetType = useRecoilValue(presetTypeAtom);
  const left = useRecoilValue(leftState);
  const [newPreset, setNewPreset] = useState<ListItemInfo[]>([]);
  const useTodoH = useTodo_h();
  const useNewPreset = useTodoH.useNewPreset();

  useEffect(() => {
    setNewPreset(left);
  }, [left]);

  const handleAddPreset = () => {
    if (newPresetTitle.trim() === '') {
      return;
    }
    const newPresetItem: ListItemInfo = {
      todoId: uuidv4(),
      todoName: newPresetTitle,
      todoType: presetType.toString(),
      todoImage: '',
      mbId: userInfo.mbId,
      chName: charName,
      createdDate: nowDate(),
    };
    setNewPreset(prevState => [...prevState, newPresetItem]);
    setNewPresetTitle('');
  };

  const handleClose = () => {
    setNewPreset(left);
    onClose();
  };

  return (
    <StyledModal open={open} onClose={onClose}>
      <ModalPaper>
        <input type="text"
          value={newPresetTitle}
          onChange={(e) => setNewPresetTitle(e.target.value)}
          placeholder="새 프리셋 추가"
        />
        <Button variant="contained" onClick={(e: any) => handleAddPreset()}>추가</Button>
        <PresetList>
          {newPreset.map(item => (
            <PresetItem key={item.todoId}>{item.todoName}</PresetItem>
          ))}
        </PresetList>
        <Button variant="contained" onClick={() => useNewPreset.mutateAsync(newPreset)}>저장</Button>
        <Button onClick={handleClose}>닫기</Button>
      </ModalPaper>
    </StyledModal>
  );
};

export default SimpleModal;
