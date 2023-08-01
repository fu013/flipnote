import Footer from "components/common/footer";
import Header from "components/common/header";
import TodoList from "components/main/todoList";
import { CmContainer, CmWrapper } from "style/commonStyled";

function App() {
  return (
    <div className="App" style={{ fontSize: "2rem" }}>
      <Header />
      <CmContainer>
        <CmWrapper>
          <h5>Today's todo list</h5>
          <TodoList />
        </CmWrapper>
      </CmContainer>
      <Footer />
    </div>
  );
}

export default App;
