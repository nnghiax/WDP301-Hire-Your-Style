import {
  Col,
  Row,
  Form,
  Badge,
  Card,
  Button,
  Pagination,
  Dropdown,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaEye, FaShoppingCart } from "react-icons/fa";
import "../css/ProductFilter.css"; // Assuming you have a CSS file for styles

function ProductFilter() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  const priceOptions = [
    { id: "all", label: "All Price", count: 1000, checked: true },
    { id: "1", label: "$0 - $100", count: 150 },
    { id: "2", label: "$100 - $200", count: 295 },
    { id: "3", label: "$200 - $300", count: 246 },
    { id: "4", label: "$300 - $400", count: 145 },
    { id: "5", label: "$400 - $500", count: 168 },
  ];

  const colorOptions = [
    { id: "all", label: "All Color", count: 1000, checked: true },
    { id: "1", label: "Black", count: 150 },
    { id: "2", label: "White", count: 295 },
    { id: "3", label: "Red", count: 246 },
    { id: "4", label: "Blue", count: 145 },
    { id: "5", label: "Green", count: 168 },
  ];

  const sizeOptions = [
    { id: "all", label: "All Size", count: 1000, checked: true },
    { id: "1", label: "XS", count: 150 },
    { id: "2", label: "S", count: 295 },
    { id: "3", label: "M", count: 246 },
    { id: "4", label: "L", count: 145 },
    { id: "5", label: "XL", count: 168 },
  ];

  const FilterSection = ({ title, options, namePrefix }) => (
    <div className="border-bottom mb-4 pb-4">
      <h5 className="fw-semibold mb-4">{title}</h5>
      <Form>
        {options.map(({ id, label, count, checked }) => (
          <div
            key={id}
            className="d-flex align-items-center justify-content-between mb-3"
          >
            <Form.Check
              type="checkbox"
              id={`${namePrefix}-${id}`}
              label={label}
              defaultChecked={checked}
              className="m-0"
            />
            <Badge bg="light" text="dark" className="border fw-normal">
              {count}
            </Badge>
          </div>
        ))}
      </Form>
    </div>
  );

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
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Phân trang
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <Row>
      {/* Filter bên trái */}
      <Col lg={3}>
        <FilterSection
          title="Filter by price"
          options={priceOptions}
          namePrefix="price"
        />
        <FilterSection
          title="Filter by color"
          options={colorOptions}
          namePrefix="color"
        />
        <FilterSection
          title="Filter by size"
          options={sizeOptions}
          namePrefix="size"
        />
      </Col>

      {/* Danh sách sản phẩm bên phải */}
      <Col lg={9}>
        <Row className="pb-3">
          <Col xs={12} className="pb-1">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <Form className="d-flex">
                <InputGroup>
                  <FormControl placeholder="Search by name" />
                  <InputGroup.Text className="bg-transparent text-primary">
                    <FaSearch />
                  </InputGroup.Text>
                </InputGroup>
              </Form>
              <Dropdown className="ms-4">
                <Dropdown.Toggle variant="outline-secondary" id="sortDropdown">
                  Sort by
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item href="#">Latest</Dropdown.Item>
                  <Dropdown.Item href="#">Popularity</Dropdown.Item>
                  <Dropdown.Item href="#">Best Rating</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>

          {/* Hiển thị 12 sản phẩm, 4 sản phẩm mỗi hàng */}
          {currentProducts.map((product) => (
            <Col lg={3} md={4} sm={6} xs={12} className="pb-1" key={product.id}>
              <Card className="product-item border-0 mb-4">
                <Card.Header className="product-img position-relative overflow-hidden bg-transparent border p-0">
                  <Card.Img
                    variant="top"
                    src={product.image}
                    className="img-fluid w-100"
                  />
                </Card.Header>
                <Card.Body className="border-start border-end text-center p-0 pt-4 pb-3">
                  <h6 className="text-truncate mb-3">{product.name}</h6>
                  <div className="d-flex justify-content-center">
                    <h6>${product.price?.toFixed(2) || "0.00"}</h6>
                    <h6 className="text-muted ms-2">
                      <del>${product.price?.toFixed(2) || "0.00"}</del>
                    </h6>
                  </div>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between bg-light border">
                  <Button variant="link" className="text-dark p-0 btn-sm">
                    <FaEye className="text-primary me-1" />
                    View Detail
                  </Button>
                  <Button variant="link" className="text-dark p-0 btn-sm">
                    <FaShoppingCart className="text-primary me-1" />
                    Add To Cart
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}

          {/* Phân trang */}
          <Col xs={12} className="pb-1">
            <Pagination className="justify-content-center mb-3">
              <Pagination.Prev
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default ProductFilter;
