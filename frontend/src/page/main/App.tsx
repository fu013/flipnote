/* eslint-disable jsx-a11y/img-redundant-alt */
import Footer from "components/common/footer";
import Header from "components/common/header";
import CharacterPreset from "components/main/characterPreset";
import TodoList from "components/main/todoList";
import TodoPreset from "components/main/todoPreset";
import RecordLogBox from "components/main/recordLogBox";
import { CmContainer, CmWrapper } from "style/commonStyled";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInAtom } from "services/recoil/auth";
import { MainTabs } from "./App.style";

const App = () => {
  const navigate = useNavigate();
  const LoggedInAtom = useRecoilValue(isLoggedInAtom);
  useEffect(() => {
    if (LoggedInAtom === false) navigate("/auth/login");
  }, []);
  return (
    <section className="App" style={{ fontSize: "2rem" }}>
      <Header />
      <CmContainer>
        <CmWrapper>
          <MainTabs>
            <CharacterPreset />
            <TodoPreset />
            <RecordLogBox />
          </MainTabs>
          <TodoList />
        </CmWrapper>
      </CmContainer>
      <Footer />
    </section>
  );
}

export default App;
