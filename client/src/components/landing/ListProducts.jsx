import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Badge,
  Collapse,
} from "react-bootstrap";
// cac chinh sach
const Featured = () => {
  const features = [
    {
      icon: "fa-check",
      title: "Quality Product",
    },
    {
      icon: "fa-shipping-fast",
      title: "Free Shipping",
    },
    {
      icon: "fa-exchange-alt",
      title: "14-Day Return",
    },
    {
      icon: "fa-phone-volume",
      title: "24/7 Support",
    },
  ];

  return (
    <Container fluid className="pt-5">
      <Row className="px-xl-5 pb-3">
        {features.map((feature, index) => (
          <Col key={index} lg={3} md={6} sm={12} className="pb-1">
            <div
              className="d-flex align-items-center border mb-4"
              style={{ padding: "30px" }}
            >
              <h1 className={`fa ${feature.icon} text-primary m-0 me-3`}></h1>
              <h5 className="font-weight-semi-bold m-0">{feature.title}</h5>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
//footer

// const Footer = () => {
//   return (
//     <div className="bg-secondary text-dark mt-5 ">
//       <Container fluid>
//         <Row className="px-xl-5 pt-5">
//           <Col lg={4} md={12} className="mb-5 pr-3 pr-xl-5">
//             <a href="#" className="text-decoration-none">
//               <h1 className="mb-4 display-5 font-weight-semi-bold">
//                 <span className="text-primary font-weight-bold border border-white px-3 mr-1">
//                   E
//                 </span>
//                 Shopper
//               </h1>
//             </a>
//             <p>
//               Dolore erat dolor sit lorem vero amet. Sed sit lorem magna, ipsum
//               no sit erat lorem et magna ipsum dolore amet erat.
//             </p>
//             <p className="mb-2">
//               <i className="fa fa-map-marker-alt text-primary mr-3"></i>
//               123 Street, New York, USA
//             </p>
//             <p className="mb-2">
//               <i className="fa fa-envelope text-primary mr-3"></i>
//               info@example.com
//             </p>
//             <p className="mb-0">
//               <i className="fa fa-phone-alt text-primary mr-3"></i>
//               +012 345 67890
//             </p>
//           </Col>

//           <Col lg={8} md={12}>
//             <Row>
//               <Col md={4} className="mb-5">
//                 <h5 className="font-weight-bold text-dark mb-4">Quick Links</h5>
//                 <div className="d-flex flex-column justify-content-start">
//                   {[
//                     "Home",
//                     "Our Shop",
//                     "Shop Detail",
//                     "Shopping Cart",
//                     "Checkout",
//                     "Contact Us",
//                   ].map((item, idx) => (
//                     <a key={idx} className="text-dark mb-2" href="#">
//                       <i className="fa fa-angle-right mr-2"></i>
//                       {item}
//                     </a>
//                   ))}
//                 </div>
//               </Col>

//               <Col md={4} className="mb-5">
//                 <h5 className="font-weight-bold text-dark mb-4">Quick Links</h5>
//                 <div className="d-flex flex-column justify-content-start">
//                   {[
//                     "Home",
//                     "Our Shop",
//                     "Shop Detail",
//                     "Shopping Cart",
//                     "Checkout",
//                     "Contact Us",
//                   ].map((item, idx) => (
//                     <a key={idx} className="text-dark mb-2" href="#">
//                       <i className="fa fa-angle-right mr-2"></i>
//                       {item}
//                     </a>
//                   ))}
//                 </div>
//               </Col>

//               <Col md={4} className="mb-5">
//                 <h5 className="font-weight-bold text-dark mb-4">Newsletter</h5>
//                 <Form>
//                   <Form.Group controlId="formName">
//                     <Form.Control
//                       type="text"
//                       placeholder="Your Name"
//                       className="border-0 py-4"
//                       required
//                     />
//                   </Form.Group>
//                   <Form.Group controlId="formEmail">
//                     <Form.Control
//                       type="email"
//                       placeholder="Your Email"
//                       className="border-0 py-4"
//                       required
//                     />
//                   </Form.Group>
//                   <Button
//                     variant="primary"
//                     type="submit"
//                     className="btn-block border-0 py-3"
//                   >
//                     Subscribe Now
//                   </Button>
//                 </Form>
//               </Col>
//             </Row>
//           </Col>
//         </Row>

//         <Row className="border-top border-light mx-xl-5 py-4">
//           <Col md={6} className="px-xl-0 text-center text-md-left">
//             <p className="mb-md-0 text-dark">
//               &copy;{" "}
//               <a className="text-dark font-weight-semi-bold" href="#">
//                 Your Site Name
//               </a>
//               . All Rights Reserved. Designed by{" "}
//               <a
//                 className="text-dark font-weight-semi-bold"
//                 href="https://htmlcodex.com"
//               >
//                 HTML Codex
//               </a>
//             </p>
//           </Col>
//           <Col md={6} className="px-xl-0 text-center text-md-right">
//             <img className="img-fluid" src="/img/payments.png" alt="Payments" />
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };
// icon back to top
const BackToTop = () => {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      variant="primary"
      className="back-to-top"
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "40px",
        right: "40px",
        borderRadius: "50%",
        width: "45px",
        height: "45px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      aria-label="Back to top"
    >
      <i className="fa fa-angle-double-up"></i>
    </Button>
  );
};

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
function TopbarNavbar(props) {
  const [open, setOpen] = React.useState(true);
  const categories = props.cate;
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
            <div className="d-flex w-100 justify-content-end align-items-center">
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
                  {/* <NavDropdown title="Dresses" id="nav-dropdown-dresses">
                    <NavDropdown.Item href="#">Men's Dresses</NavDropdown.Item>
                    <NavDropdown.Item href="#">
                      Women's Dresses
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#">Baby's Dresses</NavDropdown.Item>
                  </NavDropdown> */}
                  {categories.map((category, index) => (
                    <Nav.Link key={index} href="#" className="text-dark">
                      {category.name}
                    </Nav.Link>
                  ))}
                </Nav>
              </nav>
            </Collapse>
          </Col>

          <Col lg={9}>
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

const ListProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:9999/product/list", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProducts(res.data.data);
      } catch (error) {
        console.error("Lỗi khi tải yêu cầu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:9999/cate/list", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCategories(res.data.data);
        console.log("Categories:", res.data.data);
      } catch (error) {
        console.error("Lỗi khi tải yêu cầu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section
      id="best-sellers"
      // className="py-5 position-relative overflow-hidden"
      style={{ backgroundColor: "#f1f1f0" }}
    >
      <BackToTop />
      <TopbarNavbar cate={categories} />
      <Featured />
      <Container>
        <div className="d-flex flex-wrap justify-content-between align-items-center mt-5 mb-3">
          <h4 className="text-uppercase">Best Selling Items</h4>
          <Button variant="link" className="text-decoration-none p-0">
            View All Products
          </Button>
        </div>
        <Slider {...settings} className="product-carousel">
          {products.map((product) => (
            <div key={product.id} className="px-2">
              <Card className="border-0 bg-transparent">
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.name}
                    className="img-fluid"
                  />
                  <Button
                    variant="link"
                    className="position-absolute top-0 end-0 p-2"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        fill="currentColor"
                      />
                    </svg>
                  </Button>
                </div>
                <Card.Body className="px-0">
                  <Card.Title className="text-uppercase">
                    <Button
                      variant="link"
                      className="text-dark p-0 text-decoration-none"
                    >
                      {product.name}
                    </Button>
                  </Card.Title>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">{product.price}</span>
                    <Button
                      variant="link"
                      className="text-decoration-none p-0"
                      onClick={() => navigate(`/product-detail/${product.id}`)}
                    >
                      view details
                    </Button>
                    <Button variant="link" className="text-decoration-none p-0">
                      <i className="fas fa-shopping-cart text-primary"></i>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Slider>

        <div className="d-flex flex-wrap justify-content-between align-items-center mt-5 mb-3">
          <h4 className="text-uppercase">Best Selling Items</h4>
          <Button variant="link" className="text-decoration-none p-0">
            View All Products
          </Button>
        </div>
        <Slider {...settings} className="product-carousel">
          {products.map((product) => (
            <div key={product.id} className="px-2">
              <Card className="border-0 bg-transparent">
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.name}
                    className="img-fluid"
                  />
                  <Button
                    variant="link"
                    className="position-absolute top-0 end-0 p-2"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        fill="currentColor"
                      />
                    </svg>
                  </Button>
                </div>
                <Card.Body className="px-0">
                  <Card.Title className="text-uppercase">
                    <Button
                      variant="link"
                      className="text-dark p-0 text-decoration-none"
                    >
                      {product.name}
                    </Button>
                  </Card.Title>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">{product.price}</span>
                    <Button variant="link" className="text-decoration-none p-0">
                      Add to cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Slider>
      </Container>
    </section>
  );
};

export default ListProducts;
