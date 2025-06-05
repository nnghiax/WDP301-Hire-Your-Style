import React from "react";
import ProductFilter from "../../components/customer/ProductFilter";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { Container } from "react-bootstrap";
import BackToTop from "../../components/common/BackToTop";

function FilterProduct() {
  return (
    <>
      <BackToTop />
      <Header />
      <Container>
        <ProductFilter />
      </Container>
      <Footer />
    </>
  );
}

export default FilterProduct;
