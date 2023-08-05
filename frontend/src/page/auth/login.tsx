/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { accessTokenAtom, userInfoAtom } from "services/recoil/auth";
import { getCookie } from "services/utils/cookie";
import {
  GuideRegister,
  LoginBtn,
  LoginContainer,
  LoginWrapper,
} from "./loginStyle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAuth_h } from "services/hooks/auth.hook";
import customToast from "lib/customToast";

const Login = () => {
  const user = useRecoilValue(userInfoAtom);
  const token = useRecoilValue(accessTokenAtom);
  const navigate = useNavigate();
  const useAuthH = useAuth_h();
  const loginMutation = useAuthH.useLogin();
  useEffect(() => {
    if (getCookie("isAccess") >= 1 && user && token) {
      navigate("/");
    }
  }, []);
  const login = (e: any) => {
    e.preventDefault();
    const sendParams = {
      mbId: e.target.mbId.value,
      mbPw: e.target.mbPw.value,
    };
    if (!e.target.mbId.value) {
      customToast("아이디를 입력해주세요.", "warning");
      e.target.mbId.focus();
    } else if (!e.target.mbPw.value) {
      customToast("비밀번호를 입력해주세요.", "warning");
      e.target.mbPw.focus();
    } else {
      customToast("환영합니다.", "success");
      loginMutation.mutate(sendParams);
    }
  };
  return (
    <LoginContainer>
      <LoginWrapper>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "50ch" },
            "& label": { fontSize: "1.5rem" },
            "& input": { fontSize: "2rem" },
          }}
          noValidate
          autoComplete="on"
          onSubmit={(e: any) => login(e)}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{ textAlign: "center", marginBottom: "2.5rem" }}
          >
            <Link to={"/"}>MapleFlipnote</Link>
          </Typography>
          <TextField
            required
            id="standard-required"
            label="ID"
            defaultValue=""
            variant="standard"
            type="text"
            name="mbId"
          />
          <TextField
            required
            id="standard-required"
            label="PASSWORD"
            defaultValue=""
            variant="standard"
            type="password"
            name="mbPw"
          />
          <LoginBtn type="submit">LOGIN</LoginBtn>
        </Box>
        <GuideRegister>자동으로 로그인 정보로 회원가입됩니다.</GuideRegister>
      </LoginWrapper>
    </LoginContainer>
  );
};

export default Login;
