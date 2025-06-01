import BestSellers from "../components/landing/BestSellers";
import TopbarNavbar from "../components/landing/TopbarNavbar";
import SplashCursor from "../components/landing/SplashCursor";

function LandingPage() {
  return (
    <>
      {/* <SplashCursor /> */}
      <TopbarNavbar />
      <BestSellers />
      {/* <Header />
      <Slider />
      <Container maxWidth="lg">
        <Box sx={{ my: 5 }}>
          <AboutSection />
        </Box>
        <Box sx={{ my: 5 }}>
          <ServicesSection />
        </Box>
        <Box sx={{ my: 5 }}>
          <TeamSection />
        </Box>
        <Box sx={{ my: 5 }}>
          <PricingSection />
        </Box>
        <Box sx={{ my: 5 }}>
          <GallerySection />
        </Box>
        <Box sx={{ my: 5 }}>
          <CutDetailsSection />
        </Box>
      </Container>
      <Footer /> */}
    </>
  );
}

export default LandingPage;
