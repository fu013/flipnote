/* eslint-disable jsx-a11y/img-redundant-alt */
import Footer from "components/common/footer";
import Header from "components/common/header";
import CharacterPreset from "components/main/characterPreset";
import TodoList from "components/main/todoList";
import TodoPreset from "components/main/todoPreset";
import RecordLogBox from "components/main/recordLogBox";
import { CmContainer, CmWrapper } from "style/commonStyled";
import { useFetchChar } from "services/react-query/character.query";
import { CharacterData } from "services/interfaces/char.interface";

const App = () => {
  const { char, char_isLoading }: { char: CharacterData[], char_isLoading: boolean } = useFetchChar();
  return (
    <div className="App" style={{ fontSize: "2rem" }}>
      <Header />
      <CmContainer>
        <CmWrapper>
          <div style={{ display: "flex", alignItems: "center" }}>
            <CharacterPreset charData={char} />
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
