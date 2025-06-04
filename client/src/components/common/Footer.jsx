import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  return (
    <div className="bg-secondary text-dark mt-5 pt-5">
      <Container fluid>
        <Row className="px-xl-5 pt-5">
          <Col lg={4} md={12} className="mb-5 pr-3 pr-xl-5">
            <a href="#" className="text-decoration-none">
              <h1 className="mb-4 display-5 font-weight-semi-bold">
                <span className="text-primary font-weight-bold border border-white px-3 mr-1">
                  Hire
                </span>
                Your Style
              </h1>
            </a>
            <p>
              Chào mừng bạn đến với Hire Your - nơi Thuê Trang Phục trực tuyến
              uy tín tại Việt Nam. Chúng tôi cam kết mang đến cho bạn trải
              nghiệm tốt nhất.
            </p>
            <p className="mb-2">
              <i className="fa fa-map-marker-alt text-primary mr-3"></i>
              Khu Công Nghệ Cao Hòa Lạc, km 29, Đại lộ, Thăng Long, Hà Nội
            </p>
            <p className="mb-2">
              <i className="fa fa-envelope text-primary mr-3"></i>
              nghianthe170569@eshopper.vn
            </p>
            <p className="mb-0">
              <i className="fa fa-phone-alt text-primary mr-3"></i>
              0962286003
            </p>
          </Col>

          <Col lg={8} md={12}>
            <Row>
              <Col md={4} className="mb-5">
                <h5 className="font-weight-bold text-dark mb-4">
                  Liên kết nhanh
                </h5>
                <div className="d-flex flex-column justify-content-start">
                  {[
                    "Trang chủ",
                    "Cửa hàng",
                    "Chi tiết sản phẩm",
                    "Giỏ hàng",
                    "Thanh toán",
                    "Liên hệ",
                  ].map((item, idx) => (
                    <a key={idx} className="text-dark mb-2" href="#">
                      <i className="fa fa-angle-right mr-2"></i>
                      {item}
                    </a>
                  ))}
                </div>
              </Col>

              <Col md={4} className="mb-5">
                <h5 className="font-weight-bold text-dark mb-4">
                  Liên kết nhanh
                </h5>
                <div className="d-flex flex-column justify-content-start">
                  {[
                    "Trang chủ",
                    "Cửa hàng",
                    "Chi tiết sản phẩm",
                    "Giỏ hàng",
                    "Thanh toán",
                    "Liên hệ",
                  ].map((item, idx) => (
                    <a key={idx} className="text-dark mb-2" href="#">
                      <i className="fa fa-angle-right mr-2"></i>
                      {item}
                    </a>
                  ))}
                </div>
              </Col>

              <Col md={4} className="mb-5">
                <h5 className="font-weight-bold text-dark mb-4">
                  Đăng ký nhận tin
                </h5>
                <Form>
                  <Form.Group controlId="formName">
                    <Form.Control
                      type="text"
                      placeholder="Họ và tên"
                      className="border-0 py-4"
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Control
                      type="email"
                      placeholder="Email của bạn"
                      className="border-0 py-4"
                      required
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="btn-block border-0 py-3"
                  >
                    Đăng ký ngay
                  </Button>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="border-top border-light mx-xl-5 py-4">
          <Col md={6} className="px-xl-0 text-center text-md-left">
            <p className="mb-md-0 text-dark">
              &copy;{" "}
              <a className="text-dark font-weight-semi-bold" href="#">
                EShopper Việt Nam
              </a>
              . Đã đăng ký bản quyền. Thiết kế bởi{" "}
              <a
                className="text-dark font-weight-semi-bold"
                href="https://htmlcodex.com"
              >
                HTML Codex
              </a>
            </p>
          </Col>
          <Col md={6} className="px-xl-0 text-center text-md-right">
            <img
              className="img-fluid"
              src="/img/payments.png"
              alt="Thanh toán"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Footer;
