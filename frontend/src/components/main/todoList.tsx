/* eslint-disable jsx-a11y/img-redundant-alt */
import {
  ReactNode,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
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
import { GridBox } from "./presetStyle";
import {
  useFetchTodo,
  useFetchTodoComplete,
} from "services/react-query/todo.query";
import { charActiveNameAtom } from "services/recoil/charActive";
import { presetTypeAtom } from "services/recoil/presetType";
import { useTodo_h } from "services/hooks/todo.hook";
import SimpleModal from "components/modal/newPreset.modal";
import { getImgURL } from "lib/getImgURL";

/* 스타일 */
const CustomGridBox = styled(GridBox)(() => ({
  border: "1px solid #d3d1d1",
  padding: "2rem",
  paddingTop: "0",
}));

const CustomListItem = styled.div<{ checked: boolean }>((props) => ({
  backgroundColor: props.checked ? "skyblue" : "white",
  borderBottom: "1px solid #ddd",
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
 * 메인 공통 인자
 * @param {ListItemInfo[]} a: 선택된 데이터 리스트
 * @param {ListItemInfo[]} b: 옮길 방향에 존재하는 데이터 리스트
 */

const not = (a: ListItemInfo[], b: ListItemInfo[]) => {
  const newList: ListItemInfo[] = a.filter(
    (value) => b.findIndex((item) => item.todoId === value.todoId) === -1
  );
  return newList;
};

// checked 배열안의 값들이 left나 right 배열에 존재하는 값인지 유효성 검사를 마친 후 새 배열을 반환 / intersection: 교집합
const intersection = (a: ListItemInfo[], b: ListItemInfo[]) => {
  return a.filter(
    (value) => b.findIndex((item) => item.todoId === value.todoId) !== -1
  );
};

const union = (a: ListItemInfo[], b: ListItemInfo[]) => {
  return [...a, ...not(b, a)];
};

export const TodoList = () => {
  const charName = useRecoilValue(charActiveNameAtom);
  const presetType = useRecoilValue(presetTypeAtom);
  const { todo, todo_isLoading } = useFetchTodo();
  const { todo_c, todo_c_isLoading } = useFetchTodoComplete();
  const [left, setLeft] = useRecoilState(leftState);
  const [right, setRight] = useRecoilState(rightState);
  const [checked, setChecked] = useRecoilState(checkedState);
  const [draggedItem, setDraggedItem] = useState<ListItemInfo | null>(null);
  const [presetModalOpen, setPresetModalOpen] = useState(false);
  const useTodoH = useTodo_h();
  const useUpdateTodo = useTodoH.useUpdateTodo();

  const filterTodo = (
    array: ListItemInfo[],
    charName: string,
    presetType: string | number
  ) => {
    const filteredArray = array
      .filter(
        (item) =>
          item.chName === charName && item.todoType === presetType.toString()
      )
      .map((item, index) => ({
        ...item,
        orderNo: index,
      }));
    return filteredArray;
  };

  useEffect(() => {
    if (!todo_isLoading && !todo_c_isLoading) {
      const filteredTodo = filterTodo(todo, charName, presetType);
      const filteredTodoCompleted = filterTodo(todo_c, charName, presetType);
      setLeft(filteredTodo);
      setRight(filteredTodoCompleted);
    }
  }, [charName, presetType, todo, todo_c, todo_isLoading, todo_c_isLoading]);

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
    // 체크박스로 옮길 아이템들의 정렬 번호를, 원래 속해있었던 배열의 순서대로 유지
    newChecked.sort((a, b) => a.orderNo - b.orderNo);
    setChecked(newChecked);
  };

  // 체크 개수 개수하기
  const numberOfChecked = (items: ListItemInfo[]) =>
    intersection(checked, items).length;

  // 전체 체크박스 토글
  const handleToggleAll = (items: ListItemInfo[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  // 체크된 배열 관리, 배열 왼쪽 <> 오른쪽 옮기기 기능
  const updateListsAndChecked = (
    source: ListItemInfo[],
    destination: ListItemInfo[],
    sourceChecked: ListItemInfo[],
    setSource: Dispatch<SetStateAction<ListItemInfo[]>>,
    setDestination: Dispatch<SetStateAction<ListItemInfo[]>>,
    setChecked: Dispatch<SetStateAction<ListItemInfo[]>>
  ) => {
    const newDestination = [...destination, ...sourceChecked];
    const updatedDestination = newDestination.map((item, index) => ({
      ...item,
      orderNo: index,
    }));

    const updatedSource = not(source, sourceChecked);
    const updatedChecked = not(sourceChecked, sourceChecked);

    const updatedSourceWithOrder = updatedSource.map((item, index) => ({
      ...item,
      orderNo: index,
    }));

    setDestination(updatedDestination);
    setSource(updatedSourceWithOrder);
    setChecked(updatedChecked);
  };

  // 왼쪽 리스트 => 오른쪽 리스트로 옮기기
  const handleCheckedRight = () => {
    updateListsAndChecked(
      left,
      right,
      leftChecked,
      setLeft,
      setRight,
      setChecked
    );
  };

  // 오른쪽 리스트 => 왼쪽 리스트로 옮기기
  const handleCheckedLeft = () => {
    updateListsAndChecked(
      right,
      left,
      rightChecked,
      setRight,
      setLeft,
      setChecked
    );
  };

  // 프리셋 모달 활성화
  const handleOpenPresetModal = () => {
    setPresetModalOpen(true);
  };

  // 프리셋 모달 비활성화
  const handleClosePresetModal = () => {
    setPresetModalOpen(false);
  };

  // 드래그 시작 시 호출되는 함수
  const handleDragStart = (item: ListItemInfo) => {
    setDraggedItem(item);
  };

  // 드래그 중인 아이템 위에 커서가 올라갔을 때 호출되는 함수
  const handleDragEnter = (
    event: React.DragEvent<HTMLDivElement>,
    item: ListItemInfo,
    isLeft: boolean
  ) => {
    if (draggedItem === null || draggedItem.todoId === item.todoId) {
      return;
    }
    const updatedItems = isLeft ? [...left] : [...right];
    const draggedIndex = isLeft
      ? left.findIndex((i) => i.todoId === draggedItem.todoId)
      : right.findIndex((i) => i.todoId === draggedItem.todoId);
    const targetIndex = isLeft
      ? left.findIndex((i) => i.todoId === item.todoId)
      : right.findIndex((i) => i.todoId === item.todoId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [movedItem] = updatedItems.splice(draggedIndex, 1);
      updatedItems.splice(targetIndex, 0, {
        ...movedItem,
        orderNo: item.orderNo,
      });
      const updatedItemsWithOrder = updatedItems.map((item, index) => ({
        ...item,
        orderNo: index,
      }));
      if (isLeft) {
        setLeft(updatedItemsWithOrder);
      } else {
        setRight(updatedItemsWithOrder);
      }
    }
  };

  // 드래그 앤 드롭이 끝났을 때 호출되는 함수
  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const customList = (
    title: ReactNode,
    items: ListItemInfo[],
    isLeft: boolean
  ) => (
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
                fontSize: "3rem !important",
              },
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
              draggable // 드래그 가능한 요소로 설정
              onDragStart={() => handleDragStart(item)}
              onDragEnter={(e) => handleDragEnter(e, item, isLeft)}
              onDragEnd={handleDragEnd}
              onClick={handleToggle(item.todoId)}
              style={{
                borderColor:
                  draggedItem?.todoId === item.todoId
                    ? "lightblue"
                    : "transparent",
                borderLeftWidth: "4px", // 변경된 부분: 왼쪽에 4px의 테두리 추가
                borderLeftStyle: "solid", // 변경된 부분: 왼쪽 테두리를 실선으로 설정
              }}
              checked={
                checked.findIndex((c) => c.todoId === item.todoId) !== -1
              } // 체크 상태를 전달
            >
              <ListItemIcon sx={{ minWidth: "auto !important" }}>
                <Checkbox
                  checked={
                    checked.findIndex((c) => c.todoId === item.todoId) !== -1
                  }
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
            </CustomListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <CustomGridBox>
      <div style={{ transform: "translateY(-50%)" }}>
        <div>
          <Button variant="contained" onClick={handleOpenPresetModal}>
            프리셋 등록 또는 삭제
          </Button>
          <SimpleModal
            open={presetModalOpen}
            onClose={handleClosePresetModal}
            todo={filterTodo(todo, charName, presetType)}
            todo_c={filterTodo(todo_c, charName, presetType)}
          />
        </div>
      </div>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ "& *": { fontFamily: "Noto Sans, sans-serif !important" } }}
      >
        <Grid item>{customList("숙제 프리셋", left, true)}</Grid>
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
            <Button
              variant="contained"
              onClick={() =>
                useUpdateTodo.mutateAsync({ left: left, right: right })
              }
            >
              현재 프리셋 저장
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList("숙제 완료 내역", right, false)}</Grid>
      </Grid>
    </CustomGridBox>
  );
};

export default TodoList;
