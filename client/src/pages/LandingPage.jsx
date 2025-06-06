import ListProducts from "../components/landing/ListProducts";

import SplashCursor from "../components/common/SplashCursor";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";

function LandingPage() {
  return (
    <>
      {/* <SplashCursor /> */}
      <Header />
      <ListProducts />
      <Footer />
    </>
  );
}

export default LandingPage;
