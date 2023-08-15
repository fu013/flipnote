/* eslint-disable jsx-a11y/img-redundant-alt */
import { useEffect, useState, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "components/common/footer";
import Header from "components/common/header";
import CharacterPreset from "components/main/characterPreset";
import TodoList from "components/main/todoList";
import TodoPreset from "components/main/todoPreset";
import RecordLogBox from "components/main/recordLogBox";
import { CmContainer, CmWrapper } from "style/commonStyled";
import { useRecoilValue } from "recoil";
import { isLoggedInAtom } from "services/recoil/auth";
import { MainTabs } from "./App.style";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const App = () => {
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const [value, setValue] = useState(0);

  // Tab Value Change
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!isLoggedIn) navigate("/auth/login");
  }, []);
  return (
    <section className="App" style={{ fontSize: "2rem" }}>
      <Header />
      <CmContainer>
        <CmWrapper>
          <MainTabs>
            <CharacterPreset />
            <RecordLogBox />
          </MainTabs>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="icon label tabs example"
            sx={{
              marginBottom: "2rem",
              marginTop: "3rem",
              "& *": {
                fontFamily: "Noto Sans, sans-serif !important",
                fontSize: "1.5rem !important",
              },
            }}
          >
            <Tab label="일간" />
            <Tab label="주간" />
            <Tab label="월간" />
          </Tabs>
          {/* <TodoPreset /> */}
          <TodoList />
        </CmWrapper>
      </CmContainer>
      <Footer />
    </section>
  );
};

export default App;
