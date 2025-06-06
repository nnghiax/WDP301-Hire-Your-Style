import React from "react";
import ProductFilter from "../../components/customer/ProductFilter";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { Container } from "react-bootstrap";
import BackToTop from "../../components/common/BackToTop";
import { useLocation } from "react-router-dom";

function FilterProduct() {
  const location = useLocation();
  const products = location.state?.products || [];

  console.log("Filtered Products:", products);

  return (
    <>
      <BackToTop />
      <Header />
      <Container>
        <ProductFilter products={products} />
      </Container>
      <Footer />
    </>
  );
}

export default FilterProduct;
