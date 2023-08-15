/* eslint-disable jsx-a11y/img-redundant-alt */
import { ReactNode, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useRecoilState, useRecoilValue } from "recoil";
import { leftState, rightState, checkedState } from "services/recoil/atom";
import { ListItemInfo } from "services/interfaces/todo.interface";
import styled from "@emotion/styled";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  GridBox,
  TypeTag,
  ListItemOption,
} from "./presetStyle";
import { useFetchTodo, useFetchTodoComplete } from "services/react-query/todo.query";
import { charActiveNameAtom } from "services/recoil/charActive";
import { presetTypeAtom } from "services/recoil/presetType";
import { userInfoAtom } from "services/recoil/auth";
import { getImgURL } from "lib/getImgURL";
import { v4 as uuidv4 } from "uuid";
import { useTodo_h } from "services/hooks/todo.hook";
import { nowDate } from "lib/getNowDate";

const CustomGridBox = styled(GridBox)(() => ({
  border: "1px solid #d3d1d1",
  padding: "2rem",
  paddingTop: "0",
}));

const CustomListItem = styled.div<{ checked: boolean }>((props) => ({
  backgroundColor: props.checked ? "skyblue" : "white",
  display: "flex",
  alignItems: "center",
  padding: "8px",
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "black",
  cursor: "pointer",
}));

/* 할일 목록 리스트 체크 미완료 => 완료 기능 */
/**
 * 공통 인자
 * @param {readonly ListItemInfo[]} a: 선택된 데이터 리스트
 * @param {readonly ListItemInfo[]} b: 옮길 방향에 존재하는 데이터 리스트
 */

const not = (a: readonly ListItemInfo[], b: readonly ListItemInfo[]) => {
  return a.filter(
    (value) => b.findIndex((item) => item.todoId === value.todoId) === -1
  );
};
// checked 배열안의 값들이 left나 right 배열에 존재하는 값인지 유효성 검사를 마친 후 새 배열을 반환 / intersection: 교집합
const intersection = (
  a: readonly ListItemInfo[],
  b: readonly ListItemInfo[]
) => {
  return a.filter(
    (value) => b.findIndex((item) => item.todoId === value.todoId) !== -1
  );
};
const union = (a: readonly ListItemInfo[], b: readonly ListItemInfo[]) => {
  return [...a, ...not(b, a)];
};
export const TodoList = () => {
  const charName = useRecoilValue(charActiveNameAtom);
  const mbId = useRecoilValue(userInfoAtom);
  const presetType = useRecoilValue(presetTypeAtom);
  const { todo, todo_isLoading } = useFetchTodo();
  const { todo_c, todo_c_isLoading } = useFetchTodoComplete();
  const [left, setLeft] = useRecoilState(leftState);
  const [right, setRight] = useRecoilState(rightState);
  const [checked, setChecked] = useRecoilState(checkedState);
  const [newPresetTitle, setNewPresetTitle] = useState("");
  const useTodoH = useTodo_h();
  const useUpdateTodo = useTodoH.useUpdateTodo();

  useEffect(() => {
    if (!todo_isLoading) {
      const filteredTodo = todo.filter((item: any) => {
        const isMatch = item.chName === charName && item.todoType === presetType.toString();
        return isMatch;
      });
      const filteredTodoCompleted = todo_c.filter((item: any) => {
        const isMatch = item.chName === charName && item.todoType === presetType.toString();
        return isMatch;
      });
      setLeft(filteredTodo);
      setRight(filteredTodoCompleted);
    }
  }, [charName, presetType, todo_isLoading]);

  // 좌측, 우측 체크리스트 따로 관리할 수 있게 변수로 저장 :: 옮길 때 사용
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  // Input 체크박스 토글
  const handleToggle = (value: string) => () => {
    const currentIndex = checked.findIndex((item) => item.todoId === value);
    const newChecked = [...checked];
    const itemToAdd =
      left.find((item) => item.todoId === value) ||
      right.find((item) => item.todoId === value); // left에 value와 같은 id-item이 있는지 검사후, 없으면 right에서 item을 추가
    if (currentIndex === -1 && itemToAdd) {
      // 해당 ID가 checkd 리스트에 존재하지 않을 때, 해당 id로 아이템 추가
      newChecked.push(itemToAdd);
    } else {
      // checkd 리스트에 존재하면 해당 id의 아이템을 제거
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  // 체크 개수 개수하기
  const numberOfChecked = (items: readonly ListItemInfo[]) =>
    intersection(checked, items).length;

  // 전체 체크박스 토글
  const handleToggleAll = (items: readonly ListItemInfo[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  // 왼쪽 리스트 => 오른쪽 리스트로 옮기기
  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked).sort((a, b) => a.todoId - b.todoId)); // todoId로 순서 정렬
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  // 오른쪽 리스트 => 왼쪽 리스트로 옮기기
  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked).sort((a, b) => a.todoId - b.todoId));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  // 프리셋 추가
  const handleAddPreset = () => {
    if (newPresetTitle.trim() === '') {
      return;
    }
    const newPreset: ListItemInfo = {
      todoId: uuidv4(),
      todoName: newPresetTitle,
      todoType: presetType.toString(),
      todoImage: '',
      mbId: mbId,
      chName: charName,
      createdDate: nowDate(),
    };
    setLeft([...left, newPreset]);
    setNewPresetTitle('');
  };

  const customList = (title: ReactNode, items: readonly ListItemInfo[]) => (
    <Card>
      <CardHeader
        sx={{
          px: 2,
          py: 1,
          "& *": {
            fontSize: "1.35rem !important",
            fontWeight: "bold !important",
          },
        }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
            sx={{
              "& svg": {
                fontSize: "3rem !important"
              }
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} 선택`}
      />
      <Divider />
      <List
        sx={{
          width: 500,
          height: 500,
          bgcolor: "background.paper",
          overflow: "auto",
          "& *": {
            fontSize: "1.5rem !important",
            fontWeight: "bold !important",
          },
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((item) => {
          const labelId = `transfer-list-all-item-${item.todoId}-label`;
          return (
            <CustomListItem
              key={item.todoId}
              role="listitem"
              onClick={handleToggle(item.todoId)}
              style={{ borderBottom: "1px solid #ddd" }}
              checked={checked.findIndex((c) => c.todoId === item.todoId) !== -1} // 체크 상태를 전달
            >
              <ListItemIcon sx={{ minWidth: "auto !important" }}>
                <Checkbox
                  checked={checked.findIndex((c) => c.todoId === item.todoId) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                  sx={{ display: "none" }}
                />
              </ListItemIcon>
              {/* <img
                src={getImgURL(item.todoImage)}
                alt={`Image ${item.todoId}`}
                style={{ marginRight: "1rem" }}
              /> */}
              <ListItemText id={labelId} primary={item.todoName} />
              <ListItemOption>
                <TypeTag>기본</TypeTag>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemOption>
            </CustomListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <CustomGridBox>
      <div style={{ transform: "translateY(-50%)" }}>
        <input type="text"
          value={newPresetTitle}
          onChange={(e) => setNewPresetTitle(e.target.value)}
          placeholder="새 프리셋 추가"
        />
        <Button variant="contained" onClick={handleAddPreset}>추가</Button>
      </div>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ "& *": { fontFamily: "Noto Sans, sans-serif !important" } }}
      >
        <Grid item>{customList("숙제 프리셋", left)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
            <button type="button" onClick={() => useUpdateTodo.mutateAsync({ "left": left, "right": right })}>DB 저장</button>
          </Grid>
        </Grid>
        <Grid item>{customList("숙제 완료 내역", right)}</Grid>
      </Grid>
    </CustomGridBox>
  );
};

export default TodoList;