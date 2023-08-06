import Footer from "components/common/footer";
import Header from "components/common/header";
import CalLocation from "components/etc/CalLocation";
import { CmContainer, CmWrapper } from "style/commonStyled";

const Etc = () => {
  return (
    <section>
      <Header />
      <CmContainer>
        <CmWrapper>
          <CalLocation />
        </CmWrapper>
      </CmContainer>
      <Footer />
    </section>
  );
};

export default Etc;
