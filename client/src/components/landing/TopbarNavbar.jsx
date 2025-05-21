import React from "react";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Button,
  Badge,
  Collapse,
} from "react-bootstrap";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "rgba(0,0,0,0.5)",
        right: "10px",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "rgba(0,0,0,0.5)",
        left: "10px",
        zIndex: 1,
      }}
      onClick={onClick}
    />
  );
}

export default function TopbarNavbar() {
  const [open, setOpen] = React.useState(true);

  // Cấu hình slider react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div style={{ backgroundColor: "#f1f1f0", color: "#000" }}>
      <Container fluid>
        <Row className="bg-secondary py-2 px-xl-5">
          <Col lg={6} className="d-none d-lg-block">
            <div className="d-inline-flex align-items-center">
              <a className="text-dark" href="#">
                FAQs
              </a>
              <span className="text-muted px-2">|</span>
              <a className="text-dark" href="#">
                Help
              </a>
              <span className="text-muted px-2">|</span>
              <a className="text-dark" href="#">
                Support
              </a>
            </div>
          </Col>
          <Col lg={6} className="text-center text-lg-right">
            <div className="d-inline-flex align-items-center">
              <a className="text-dark px-2" href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a className="text-dark px-2" href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a className="text-dark px-2" href="#">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a className="text-dark px-2" href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a className="text-dark pl-2" href="#">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </Col>
        </Row>

        <Row
          className="align-items-center py-3 px-xl-5"
          style={{ backgroundColor: "#f1f1f0" }}
        >
          <Col lg={3} className="d-none d-lg-block">
            <a href="#" className="text-decoration-none">
              <h1 className="m-0 display-5 font-weight-semi-bold">
                <span className="text-primary font-weight-bold border px-3 mr-1">
                  E
                </span>
                Shopper
              </h1>
            </a>
          </Col>

          <Col lg={6} xs={6} className="text-left">
            <Form>
              <Form.Control
                type="text"
                placeholder="Search for products"
                style={{ backgroundColor: "#fff" }}
              />
            </Form>
          </Col>

          <Col lg={3} xs={6} className="text-right">
            <Button variant="light" className="border mr-2">
              <i className="fas fa-heart text-primary"></i>
              <Badge variant="danger" className="ml-1">
                0
              </Badge>
            </Button>
            <Button variant="light" className="border">
              <i className="fas fa-shopping-cart text-primary"></i>
              <Badge variant="danger" className="ml-1">
                0
              </Badge>
            </Button>
          </Col>
        </Row>
      </Container>

      <Container fluid className="mb-5" style={{ backgroundColor: "#f1f1f0" }}>
        <Row className="border-top px-xl-5">
          <Col lg={3} className="d-none d-lg-block">
            <Button
              variant="primary"
              className="d-flex align-items-center justify-content-between w-100 shadow-none"
              style={{ height: "65px", marginTop: "-1px", padding: "0 30px" }}
              onClick={() => setOpen(!open)}
              aria-controls="navbar-vertical"
              aria-expanded={open}
            >
              <h6 className="m-0 text-white">Categories</h6>
              <i
                className={`fa fa-angle-${open ? "up" : "down"} text-dark`}
              ></i>
            </Button>

            <Collapse in={open}>
              <nav
                id="navbar-vertical"
                className="navbar navbar-vertical navbar-light align-items-start p-0 border border-top-0 border-bottom-0"
                style={{
                  maxHeight: "410px",
                  overflowY: "auto",
                  backgroundColor: "#fff",
                }}
              >
                <Nav className="flex-column w-100">
                  <NavDropdown title="Dresses" id="nav-dropdown-dresses">
                    <NavDropdown.Item href="#">Men's Dresses</NavDropdown.Item>
                    <NavDropdown.Item href="#">
                      Women's Dresses
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#">Baby's Dresses</NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link href="#" className="text-dark">
                    Shirts
                  </Nav.Link>
                  <Nav.Link href="#" className="text-dark">
                    Jeans
                  </Nav.Link>
                  <Nav.Link href="#" className="text-dark">
                    Swimwear
                  </Nav.Link>
                  <Nav.Link href="#" className="text-dark">
                    Sleepwear
                  </Nav.Link>
                  <Nav.Link href="#" className="text-dark">
                    Sportswear
                  </Nav.Link>
                  <Nav.Link href="#" className="text-dark">
                    Jumpsuits
                  </Nav.Link>
                  <Nav.Link href="#" className="text-dark">
                    Blazers
                  </Nav.Link>
                  <Nav.Link href="#" className="text-dark">
                    Jackets
                  </Nav.Link>
                  <Nav.Link href="#" className="text-dark">
                    Shoes
                  </Nav.Link>
                </Nav>
              </nav>
            </Collapse>
          </Col>

          <Col lg={9}>
            <Navbar bg="light" expand="lg" className="py-3 py-lg-0 px-0">
              <Navbar.Brand href="#" className="d-block d-lg-none">
                <h1 className="m-0 display-5 font-weight-semi-bold">
                  <span className="text-primary font-weight-bold border px-3 mr-1">
                    E
                  </span>
                  Shopper
                </h1>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarCollapse" />
              <Navbar.Collapse
                id="navbarCollapse"
                className="justify-content-between"
              >
                <Nav className="mr-auto py-0">
                  <Nav.Link href="index.html" active className="text-dark">
                    Home
                  </Nav.Link>
                  <Nav.Link href="shop.html" className="text-dark">
                    Shop
                  </Nav.Link>
                  <Nav.Link href="detail.html" className="text-dark">
                    Shop Detail
                  </Nav.Link>
                  <NavDropdown
                    title="Pages"
                    id="nav-dropdown-pages"
                    className="text-dark"
                  >
                    <NavDropdown.Item href="cart.html">
                      Shopping Cart
                    </NavDropdown.Item>
                    <NavDropdown.Item href="checkout.html">
                      Checkout
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link href="contact.html" className="text-dark">
                    Contact
                  </Nav.Link>
                </Nav>
                <Nav className="ml-auto py-0">
                  <Nav.Link href="#" className="text-dark">
                    Login
                  </Nav.Link>
                  <Nav.Link href="#" className="text-dark">
                    Register
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>

            {/* Slider */}
            <Slider {...sliderSettings} className="mt-4">
              <div>
                <div style={{ position: "relative" }}>
                  <img
                    src="/img/carousel-1.jpg"
                    alt="Slide 1"
                    style={{
                      width: "100%",
                      height: "410px",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "rgba(255,255,255,0.8)",
                      padding: "20px",
                      borderRadius: "5px",
                      textAlign: "center",
                      color: "#000",
                    }}
                  >
                    <h3>Slide 1 Title</h3>
                    <p>Description for slide 1 goes here</p>
                    <Button variant="primary">Shop Now</Button>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ position: "relative" }}>
                  <img
                    src="/img/carousel-2.jpg"
                    alt="Slide 2"
                    style={{
                      width: "100%",
                      height: "410px",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "rgba(255,255,255,0.8)",
                      padding: "20px",
                      borderRadius: "5px",
                      textAlign: "center",
                      color: "#000",
                    }}
                  >
                    <h3>Slide 2 Title</h3>
                    <p>Description for slide 2 goes here</p>
                    <Button variant="primary">Shop Now</Button>
                  </div>
                </div>
              </div>
            </Slider>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
