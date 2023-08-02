/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import * as config from "config/constants.config";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { accessTokenAtom, userInfoAtom } from "services/recoil/auth";
import { getCookie } from "services/utils/cookie";
import {
  GuideRegister,
  LoginBtn,
  LoginContainer,
  LoginKakaoBtn,
  LoginWrapper,
  MoveRegister,
} from "./loginStyle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAuth_h } from "services/hooks/auth.hook";

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
      mb_id: e.target.mb_id.value,
      mb_pw: e.target.mb_pw.value,
    };
    if (!e.target.mb_id.value) {
      alert("아이디를 입력해주세요.");
      e.target.mb_id.focus();
    } else if (!e.target.mb_pw.value) {
      alert("비밀번호를 입력해주세요.");
      e.target.mb_pw.focus();
    } else {
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
            <Link to={"/"}>Dogrimong</Link>
          </Typography>
          <TextField
            required
            id="standard-required"
            label="아이디"
            defaultValue=""
            variant="standard"
            type="text"
            name="mb_id"
          />
          <TextField
            required
            id="standard-required"
            label="비밀번호"
            defaultValue=""
            variant="standard"
            type="password"
            name="mb_pw"
          />
          <LoginBtn type="submit">로그인</LoginBtn>
        </Box>
        <GuideRegister>
          도그리몽에 처음이세요? &nbsp;&nbsp;&nbsp;
          <Link to="/register">
            <MoveRegister>회원 가입하기</MoveRegister>
          </Link>
        </GuideRegister>
      </LoginWrapper>
    </LoginContainer>
  );
};

export default Login;
