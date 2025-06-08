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
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [activeSearchValue, setActiveSearchValue] = useState(""); // Giá trị tìm kiếm thực tế
  const [selectedCategory, setSelectedCategory] = useState("");
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
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:9999/product/list", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProducts(res.data.data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    const filterSearch = products.filter((rep) => {
      let matchesSearch = true;
      let matchesCategory = true;
      if (activeSearchValue) {
        const keyword = removeVietnameseTones(activeSearchValue.toLowerCase());
        const productName = removeVietnameseTones(
          String(rep?.name).toLowerCase()
        );
        matchesSearch = productName.includes(keyword);
      }
      if (selectedCategory) {
        matchesCategory = String(rep.categoryId) === String(selectedCategory);
      }
      return matchesSearch && matchesCategory;
    });
    setFilterProducts(filterSearch);
    navigate(
      `/filter-product?search=${encodeURIComponent(
        activeSearchValue
      )}&category=${encodeURIComponent(selectedCategory || "")}`,
      {
        state: { products: filterSearch },
      }
    );
  }, [activeSearchValue, selectedCategory, products]);

  function removeVietnameseTones(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }

  const handleSearch = () => {
    setActiveSearchValue(searchValue); // Cập nhật giá trị tìm kiếm thực tế
  };

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
            <Form
              className="d-flex"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <Form.Control
                type="text"
                placeholder="Tìm kiếm sản phẩm"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                style={{ backgroundColor: "#fff" }}
              />
              <Button variant="primary" className="ml-2" type="submit">
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
      <Container fluid style={{ backgroundColor: "#f1f1f0" }}>
        <Row className="border-top px-xl-5">
          <Col lg={3} className="d-none d-lg-block position-relative">
            <Button
              variant="primary"
              className="d-flex align-items-center justify-content-between w-100 shadow-none"
              style={{ height: "65px", marginTop: "-1px", padding: "0 30px" }}
              onClick={() => setOpen(!open)}
              aria-expanded={open}
            >
              <h6 className="m-0 text-white">Danh mục</h6>
              <i
                className={`fa fa-angle-${open ? "up" : "down"} text-dark`}
              ></i>
            </Button>
            {open && (
              <nav
                className="navbar navbar-vertical navbar-light align-items-start p-0 border border-top-0 border-bottom-0"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 1050,
                  width: "100%",
                  maxHeight: "410px",
                  overflowY: "auto",
                  backgroundColor: "#fff",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Nav className="flex-column w-100">
                  <Nav.Link
                    key={0}
                    href="#"
                    className={`text-dark ${
                      selectedCategory === "" ? "fw-bold" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCategory("");
                      setOpen(false);
                    }}
                  >
                    Tất cả danh mục
                  </Nav.Link>
                  {categories.map((category, index) => (
                    <Nav.Link
                      key={index + 1}
                      href="#"
                      className={`text-dark ${
                        selectedCategory === category._id ? "fw-bold" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCategory(category._id);
                        setOpen(false);
                      }}
                    >
                      {category.name}
                    </Nav.Link>
                  ))}
                </Nav>
              </nav>
            )}
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
                  <Nav.Link href="/" className="text-dark">
                    Trang chủ
                  </Nav.Link>
                  <Nav.Link href="/shop" className="text-dark">
                    Cửa hàng
                  </Nav.Link>
                  <Nav.Link href="/detail" className="text-dark">
                    Chi tiết sản phẩm
                  </Nav.Link>
                  <NavDropdown
                    title="Trang"
                    id="nav-dropdown-pages"
                    className="text-dark"
                  >
                    <NavDropdown.Item href="/cart">Giỏ hàng</NavDropdown.Item>
                    <NavDropdown.Item href="/checkout">
                      Thanh toán
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link href="/contact" className="text-dark">
                    Liên hệ
                  </Nav.Link>
                </Nav>
                <Nav className="ml-auto py-0">
                  <Nav.Link
                    onClick={() => navigate("/login")}
                    className="text-dark"
                  >
                    Đăng nhập
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => navigate("/register")}
                    className="text-dark"
                  >
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
