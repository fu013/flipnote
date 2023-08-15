/* eslint-disable jsx-a11y/img-redundant-alt */
import { useEffect, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "components/common/footer";
import Header from "components/common/header";
import CharacterPreset from "components/main/characterPreset";
import TodoList from "components/main/todoList";
import RecordLogBox from "components/main/recordLogBox";
import { CmContainer, CmWrapper } from "style/commonStyled";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoggedInAtom } from "services/recoil/auth";
import { MainTabs } from "./App.style";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { presetTypeAtom } from "services/recoil/presetType";

const App = () => {
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const [presetType, setPresetType] = useRecoilState(presetTypeAtom);
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setPresetType(newValue);
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
            value={presetType}
            onChange={handleChange}
            aria-label="icon label tabs example"
            sx={{
              marginBottom: "4rem",
              marginTop: "3rem",
              "& *": {
                fontFamily: "Noto Sans, sans-serif !important",
                fontSize: "1.5rem !important",
              },
            }}
          >
            <Tab label="일간" />
            <Tab label="주간(월)" />
            <Tab label="주간(목)" />
            <Tab label="월간" />
          </Tabs>
          <TodoList />
        </CmWrapper>
      </CmContainer>
      <Footer />
    </section>
  );
};

export default App;
