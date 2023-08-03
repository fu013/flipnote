import {
  PresetAdd,
  PresetBox,
  PresetDelete,
  PresetItem,
  PresetTitle,
  PresetContainer,
  PresetCharacterName,
} from "./presetStyle";

const names = ["삔제", "삔러", "삔쉘", "삔젤", "햄스타"]; // 사용자가 등록한 캐릭터명

export default function characterPreset() {
  return (
    <PresetContainer>
      <PresetAdd>
        <input type="text" placeholder="캐릭터 명" />
        <button type="button">⬇</button>
      </PresetAdd>
      <PresetBox>
        <PresetItem className="active">
          <PresetTitle>
            Lv.278 <PresetCharacterName>삔제</PresetCharacterName>
          </PresetTitle>
          <PresetDelete>제거</PresetDelete>
        </PresetItem>
        <PresetItem>
          <PresetTitle>
            Lv.280 <PresetCharacterName>삔쉘</PresetCharacterName>
          </PresetTitle>
          <PresetDelete>제거</PresetDelete>
        </PresetItem>
        <PresetItem>
          <PresetTitle>
            Lv.276 <PresetCharacterName>햄스타</PresetCharacterName>
          </PresetTitle>
          <PresetDelete>제거</PresetDelete>
        </PresetItem>
      </PresetBox>
    </PresetContainer>
  );
}
