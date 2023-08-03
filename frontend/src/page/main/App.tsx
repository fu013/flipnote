/* eslint-disable jsx-a11y/img-redundant-alt */
import Footer from "components/common/footer";
import Header from "components/common/header";
import CharacterPreset from "components/main/characterPreset";
import TodoList from "components/main/todoList";
import TodoPreset from "components/main/todoPreset";
import RecordLogBox from "components/main/recordLogBox";
import { getImgURL } from "lib/getImgURL";
import { CmContainer, CmWrapper } from "style/commonStyled";
import { CharacterCard, CharacterLevel, CharacterName } from "./App.style";

function App() {
  return (
    <div className="App" style={{ fontSize: "2rem" }}>
      <Header />
      <CmContainer>
        <CmWrapper>
          <div style={{ display: "flex", alignItems: "center" }}>
            <CharacterCard>
              <img
                src={getImgURL("default.png")}
                alt="character Profile Image"
              />
              <CharacterName>삔제</CharacterName>
              <CharacterLevel>Lv. 278</CharacterLevel>
            </CharacterCard>
            <CharacterPreset />
            <TodoPreset />
            <RecordLogBox />
          </div>
          <TodoList />
        </CmWrapper>
      </CmContainer>
      <Footer />
    </div>
  );
}

export default App;
