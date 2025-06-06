import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:9999/product/list", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProducts(res.data.data);
        console.log("Products:", res.data.data);
      } catch (error) {
        console.error("Lỗi khi tải yêu cầu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const filterSearch = products.filter((rep) => {
      let matchesSearch = true;
      let matchesSort = true;
      let matchesRadio = true;
      let matchesCheckBox = true;
      let matchesSelectUser = true;

      if (searchValue) {
        matchesSearch = String(rep?.name)
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      }

      return matchesCheckBox & matchesSearch;
    });
    setFilterProducts(filterSearch);
  }, [searchValue, products, categories]);

  return (
    <div style={{ backgroundColor: "#f1f1f0", color: "#000" }}>
      <Container fluid>
        <Row className="bg-secondary py-2 px-xl-5">
          <Col lg={6} className="d-none d-lg-block">
            <div className="d-inline-flex align-items-center">
              <a className="text-dark" href="#">
                Câu hỏi thường gặp
              </a>
              <span className="text-muted px-2">|</span>
              <a className="text-dark" href="#">
                Trợ giúp
              </a>
              <span className="text-muted px-2">|</span>
              <a className="text-dark" href="#">
                Hỗ trợ
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
                  Hire
                </span>
                Your Style
              </h1>
            </a>
          </Col>

          <Col lg={6} xs={6} className="text-left">
            <Form className="d-flex">
              <Form.Control
                type="text"
                placeholder="Tìm kiếm sản phẩm"
                style={{ backgroundColor: "#fff" }}
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
              />
              <Button
                variant="primary"
                className="ml-2"
                onClick={() =>
                  navigate(
                    "/filter-product?search=" + encodeURIComponent(searchValue),
                    {
                      state: { products: filterProducts },
                    }
                  )
                }
              >
                <i className="fas fa-search"></i>
              </Button>
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
              <h6 className="m-0 text-white">Danh mục</h6>
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
            <Navbar bg="light" expand="lg" className="py-3 py-lg-0 px-0">
              <Navbar.Brand href="#" className="d-block d-lg-none">
                <h1 className="m-0 display-5 font-weight-semi-bold">
                  <span className="text-primary font-weight-bold border px-3 mr-1">
                    Hire
                  </span>
                  Your Style
                </h1>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarCollapse" />
              <Navbar.Collapse
                id="navbarCollapse"
                className="justify-content-between"
              >
                <Nav className="mr-auto py-0">
                  <Nav.Link href="index.html" active className="text-dark">
                    Trang chủ
                  </Nav.Link>
                  <Nav.Link href="shop.html" className="text-dark">
                    Cửa hàng
                  </Nav.Link>
                  <Nav.Link href="detail.html" className="text-dark">
                    Chi tiết sản phẩm
                  </Nav.Link>
                  <NavDropdown
                    title="Trang"
                    id="nav-dropdown-pages"
                    className="text-dark"
                  >
                    <NavDropdown.Item href="cart.html">
                      Giỏ hàng
                    </NavDropdown.Item>
                    <NavDropdown.Item href="checkout.html">
                      Thanh toán
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link href="contact.html" className="text-dark">
                    Liên hệ
                  </Nav.Link>
                </Nav>
                <Nav className="ml-auto py-0">
                  <Nav.Link href="#" className="text-dark">
                    Đăng nhập
                  </Nav.Link>
                  <Nav.Link href="#" className="text-dark">
                    Đăng ký
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
