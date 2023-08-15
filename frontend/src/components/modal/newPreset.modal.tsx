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

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: "500px", height: "500px", transform: 'translate(-50%, -50%)' }}>
        <Paper style={{ padding: '16px', height: "100%" }}>
          <input type="text"
            value={newPresetTitle}
            onChange={(e) => setNewPresetTitle(e.target.value)}
            placeholder="새 프리셋 추가"
          />
          <Button variant="contained" onClick={(e: any) => handleAddPreset()}>추가</Button>
          <Button variant="contained" onClick={() => useNewPreset.mutateAsync(newPreset)}>저장</Button>
          <Button onClick={onClose}>닫기</Button>
        </Paper>
      </div>
    </Modal>
  );
};

export default SimpleModal;
