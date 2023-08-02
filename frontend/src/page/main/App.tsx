import Footer from "components/common/footer";
import Header from "components/common/header";
import CharacterList from "components/main/characterList";
import TodoList from "components/main/todoList";
import { getImgURL } from "lib/getImgURL";
import { CmContainer, CmWrapper } from "style/commonStyled";

function App() {
  return (
    <div className="App" style={{ fontSize: "2rem" }}>
      <Header />
      <CmContainer>
        <CmWrapper>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={getImgURL("default.png")} alt="character profile" />
            <CharacterList />
          </div>
          <h5>일간 | 주간 | 월간</h5>
          <TodoList />
        </CmWrapper>
      </CmContainer>
      <Footer />
    </div>
  );
}

export default App;
