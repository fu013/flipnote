import Footer from "components/common/footer";
import Header from "components/common/header";
import { CmContainer, CmWrapper } from "style/commonStyled";

const Etc = () => {
  return (
    <section>
      <Header />
      <CmContainer>
        <CmWrapper>
          JSON 생성기
        </CmWrapper>
      </CmContainer>
      <Footer />
    </section>
  );
};

export default Etc;
