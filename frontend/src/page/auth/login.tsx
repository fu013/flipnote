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
  LoginWrapper,
} from "./loginStyle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAuth_h } from "services/hooks/auth.hook";
import { toast } from "react-toastify";

const Login = () => {
  const user = useRecoilValue(userInfoAtom);
  const token = useRecoilValue(accessTokenAtom);
  const navigate = useNavigate();
  const useAuthH = useAuth_h();
  const loginMutation = useAuthH.useLogin();
  const showWarningToast = (message: string) => {
    toast.warning(message, { position: "top-center" });
  };
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
      showWarningToast("아이디를 입력해주세요.");
      e.target.mb_id.focus();
    } else if (!e.target.mb_pw.value) {
      showWarningToast("비밀번호를 입력해주세요.");
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
            <Link to={"/"}>MapleFlipnote</Link>
          </Typography>
          <TextField
            required
            id="standard-required"
            label="ID"
            defaultValue=""
            variant="standard"
            type="text"
            name="mb_id"
          />
          <TextField
            required
            id="standard-required"
            label="PASSWORD"
            defaultValue=""
            variant="standard"
            type="password"
            name="mb_pw"
          />
          <LoginBtn type="submit">LOGIN</LoginBtn>
        </Box>
        <GuideRegister>자동으로 로그인 정보로 회원가입됩니다.</GuideRegister>
      </LoginWrapper>
    </LoginContainer>
  );
};

export default Login;
