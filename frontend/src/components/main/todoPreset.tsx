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
  PresetAddBtn
} from "./presetStyle";
const TodoPreset = () => {
  return (
    <PresetContainer>
      <PresetAdd>
        <PresetAddInput type="text" placeholder="프리셋 명" />
        <PresetAddBtn type="button">⬇</PresetAddBtn>
      </PresetAdd>
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
      </PresetBox>
    </PresetContainer>
  );
};

export default TodoPreset;
