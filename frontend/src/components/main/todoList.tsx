/* eslint-disable jsx-a11y/img-redundant-alt */
import { ReactNode, useState } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { getImgURL } from "lib/getImgURL";

// 리스트 아이템 타입 인터페이스 정의
interface ListItemInfo {
  id: number;
  image: string;
  name: string;
}

/**
 * 할일 목록 리스트 체크 미완료 => 완료 기능
 * Params description
 * a: 선택된 데이터 리스트
 * b: 옮길 방향에 존재하는 데이터 리스트
 */
const not = (a: readonly ListItemInfo[], b: readonly ListItemInfo[]) => {
  return a.filter(
    (value) => b.findIndex((item) => item.id === value.id) === -1
  );
};
// checked 배열안의 값들이 left나 right 배열에 존재하는 값인지 유효성 검사를 마친 후 새 배열을 반환 / intersection: 교집합
const intersection = (
  a: readonly ListItemInfo[],
  b: readonly ListItemInfo[]
) => {
  return a.filter(
    (value) => b.findIndex((item) => item.id === value.id) !== -1
  );
};
const union = (a: readonly ListItemInfo[], b: readonly ListItemInfo[]) => {
  return [...a, ...not(b, a)];
};
export const TodoList = () => {
  const [checked, setChecked] = useState<readonly ListItemInfo[]>([]);
  const [left, setLeft] = useState<readonly ListItemInfo[]>([
    { id: 0, image: "image088.png", name: "소멸의 여로 심볼" },
    { id: 1, image: "image090.png", name: "츄츄 심볼" },
    { id: 2, image: "image092.png", name: "레헬른 심볼" },
    { id: 3, image: "image094.png", name: "아르카나 심볼" },
    { id: 4, image: "image050.png", name: "모라스 심볼" },
    { id: 5, image: "image052.png", name: "에스페라 심볼" },
  ]);
  const [right, setRight] = useState<readonly ListItemInfo[]>([]);

  // 좌측, 우측 체크리스트 따로 관리할 수 있게 변수로 저장 :: 옮길 때 사용
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  // Input 체크박스 토글
  const handleToggle = (value: number) => () => {
    console.log(JSON.stringify(checked));
    const currentIndex = checked.findIndex((item) => item.id === value);
    const newChecked = [...checked];
    const itemToAdd =
      left.find((item) => item.id === value) ||
      right.find((item) => item.id === value); // left에 value와 같은 id-item이 있는지 검사후, 없으면 right에서 item을 추가
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
    setRight(right.concat(leftChecked).sort((a, b) => a.id - b.id)); // id로 순서 정렬
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };
  // 오른쪽 리스트 => 왼쪽 리스트로 옮기기
  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked).sort((a, b) => a.id - b.id));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: ReactNode, items: readonly ListItemInfo[]) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
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
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} 선택`}
      />
      <Divider />
      <List
        sx={{
          width: 650,
          height: 600,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((item) => {
          const labelId = `transfer-list-all-item-${item.id}-label`;

          return (
            <ListItem
              key={item.id}
              role="listitem"
              onClick={handleToggle(item.id)}
            >
              냐옹 : {item.id}
              <ListItemIcon>
                <Checkbox
                  checked={checked.findIndex((c) => c.id === item.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <img src={getImgURL(item.image)} alt={`Image ${item.id}`} />
              <ListItemText id={labelId} primary={item.name} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList("오늘의 할일", left)}</Grid>
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
        </Grid>
      </Grid>
      <Grid item>{customList("완료된 일들", right)}</Grid>
    </Grid>
  );
};

export default TodoList;