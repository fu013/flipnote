import styled from "@emotion/styled";

const FooterBox = styled.div`
  height: 5rem;
  line-height: 5rem;
  font-size: 1.5rem;
  border-top: 1px solid #ddd;
  text-align: center;
  color: #aaa;
`;

const Footer = () => {
  return (
    <FooterBox>Copyright ⓒ 2023 dailyMaple. All Right Reserved.</FooterBox>
  );
};

export default Footer;
