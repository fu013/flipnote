import styled from "@emotion/styled";
import background from "static/images/background_1.png";

export const LoginContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #f3f5f7;
  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: url(${background});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    filter: brightness(0.7);
  }
`;

export const LoginWrapper = styled.div`
  width: 100%;
  background: #fff;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 45%;
  left: 50%;
  padding: 6.8rem;
  border-radius: 8px;
  box-shadow: 1px 5px 7px rgba(0, 0, 0, 0.15);
  max-width: 45rem;
  min-height: 72rem;
`;

export const LoginBtn = styled.button`
  cursor: pointer;
  text-align: center;
  vertical-align: middle;
  font-size: 1.5rem;
  height: 4.7rem;
  font-weight: 500;
  border-radius: 2.5rem;
  border: 1px solid #ff9b85 !important;
  background-color: #ff9b85 !important;
  color: #ffffff;
  margin-top: 4.5rem;
  width: 100%;
`;

export const GuideRegister = styled.div`
  margin-top: 1rem;
  font-size: 1.4rem;
  text-align: center;
`;

export const MoveRegister = styled.span`
  color: #ff9b85;
`;

export const LoginKakaoBtn = styled.a`
  display: block;
  width: 100%;
  cursor: pointer;
  margin-top: 0.5rem;
`;
