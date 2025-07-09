import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

const RentalHistory = ({ userId }) => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const navigate = useNavigate();

  const fetchRentalHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực");


      const response = await axios.get(
        "http://localhost:9999/rental/list/by-user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      setRentals(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      setReviewError(null);
      setReviewSuccess(null);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:9999/review/create",
        {
          rentalId: selectedRental._id,
          rating: reviewData.rating,
          comment: reviewData.comment
        },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      setReviewSuccess(response.data.message);
      setReviewData({ rating: 5, comment: '' });
      setTimeout(() => {
        setShowReviewModal(false);
        fetchRentalHistory(); // Refresh rentals
      }, 1000);
    } catch (err) {
      setReviewError(err.response?.data?.message || "Lỗi khi gửi đánh giá");
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "badge bg-warning text-dark",
      confirmed: "badge bg-primary",
      cancelled: "badge bg-danger",
      completed: "badge bg-success",
    };
    const statusText = {
      pending: "Đang chờ",
      confirmed: "Đã xác nhận",
      cancelled: "Đã hủy",
      completed: "Hoàn thành",
    };
    return (
      <Badge className={statusClasses[status]} style={{ borderRadius: "0.5rem", padding: "0.4rem 0.8rem" }}>
        {statusText[status] || status}
      </Badge>
    );
  };

  useEffect(() => {
    fetchRentalHistory();
  }, [userId]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border" style={{ color: "#8A784E" }} role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="rounded-4 text-center">
          <i className="fas fa-exclamation-triangle me-2"></i>{error}
        </Alert>
      </Container>
    );
  }

  return (
    <section style={{ backgroundColor: "#F2F2F2", padding: "3rem 0" }}>
      <Container>
        <h1 className="text-center mb-4 fw-semibold text-uppercase" style={{ color: "#8A784E" }}>
          <i className="fas fa-history me-2"></i>Lịch Sử Thuê
        </h1>

        {rentals.length === 0 ? (
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="text-center py-5">
              <h4 className="fw-semibold">Bạn chưa có đơn thuê nào</h4>
              <p className="text-muted lead">
                Hãy thuê sản phẩm để bắt đầu trải nghiệm
              </p>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            <Col lg={12}>
              {rentals.map((rental) => (
                <Card key={rental._id} className="border-0 shadow-sm rounded-4 mb-4">
                  <Card.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: "#f1f1f0" }}>
                    <div>
                      <strong>Mã đơn thuê: {rental._id}</strong>
                      <span className="ms-3">{getStatusBadge(rental.status)}</span>
                    </div>
                    <div className="text-muted">
                      <small>Ngày tạo: {formatDate(rental.createdAt)}</small>
                    </div>
                  </Card.Header>

                  <Card.Body>
                    <Row className="mb-3">
                      <Col md={6}>
                        <p>
                          <strong>Ngày thuê:</strong> {formatDate(rental.rentalDate)}
                        </p>
                        <p>
                          <strong>Ngày trả:</strong> {formatDate(rental.returnDate)}
                        </p>
                      </Col>
                      <Col md={6}>
                        <p>
                          <strong>Tổng tiền:</strong> {formatPrice(rental.totalAmount)}
                        </p>
                        <p>
                          <strong>Tiền cọc:</strong> {formatPrice(rental.depositAmount)}
                        </p>
                      </Col>
                    </Row>

                    <h5 className="mb-3 fw-semibold" style={{ color: "#8A784E" }}>
                      Sản phẩm đã thuê:
                    </h5>
                    <div className="table-responsive">
                      <Table>
                        <thead>
                          <tr>
                            <th>Sản phẩm</th>
                            <th>Cửa hàng</th>
                            <th>Size</th>
                            <th>Số lượng</th>
                            <th>Giá thuê/ngày</th>
                            <th>Tổng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rental.items.map((item, index) => {
                            const product = item.productId || {};
                            const rentalStore = item.storeId || {};
                            const rentalDays = Math.ceil(
                              (new Date(rental.returnDate) - new Date(rental.rentalDate)) /
                              (1000 * 60 * 60 * 24)
                            );
                            const itemTotal = (product.price || 0) * item.quantity * rentalDays;

                            return (
                              <tr key={index}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img
                                      src={product.image || `https://picsum.photos/80?random=${index}`}
                                      alt={product.name}
                                      className="img-thumbnail me-3 rounded-4"
                                      style={{ width: "60px", height: "80px", objectFit: "cover" }}
                                    />
                                    <div>
                                      <h6 className="mb-0 fw-semibold">{product.name}</h6>
                                      <small className="text-muted">{product.category}</small>
                                    </div>
                                  </div>
                                </td>
                                <td>{rentalStore.name}</td>
                                <td>{item.size}</td>
                                <td>{item.quantity}</td>
                                <td>{formatPrice(product.price)}</td>
                                <td>{formatPrice(itemTotal)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>

                  <Card.Footer className="text-end">
                    <Button
                      variant="outline-primary"
                      className="rounded-4 me-2"
                      onClick={() => navigate(`/product-detail/${rental.items[0].productId._id}/${rental.items[0].storeId._id}`)}
                    >
                      Thuê lại
                    </Button>
                    {rental.status === "completed" && (
                      <Button
                        variant="outline-success"
                        className="rounded-4 me-2"
                        onClick={() => {
                          setSelectedRental(rental);
                          setShowReviewModal(true);
                        }}
                      >
                        Đánh giá
                      </Button>
                    )}
                    <Button
                      variant="outline-secondary"
                      className="rounded-4"
                      onClick={() => navigate(`/rental-detail/${rental._id}`)}
                    >
                      Chi tiết
                    </Button>
                  </Card.Footer>
                </Card>
              ))}
            </Col>
          </Row>
        )}

        <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
          <Modal.Header className="border-0" style={{ backgroundColor: "#f1f1f0" }}>
            <Modal.Title className="fw-semibold" style={{ color: "#8A784E" }}>
              <i className="fas fa-star me-2"></i>Đánh giá sản phẩm
            </Modal.Title>
            <Button
              variant="link"
              className="p-0"
              onClick={() => setShowReviewModal(false)}
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </Button>
          </Modal.Header>
          <Modal.Body>
            {selectedRental && (
              <div className="mb-3">
                <strong>Sản phẩm:</strong> {selectedRental.items[0].productId?.name}
                <br />
                <strong>Cửa hàng:</strong> {selectedRental.items[0].storeId?.name}
              </div>
            )}
            {reviewSuccess && (
              <Alert variant="success" className="rounded-4">
                <i className="fas fa-check-circle me-2"></i>{reviewSuccess}
              </Alert>
            )}
            {reviewError && (
              <Alert variant="danger" className="rounded-4">
                <i className="fas fa-exclamation-triangle me-2"></i>{reviewError}
              </Alert>
            )}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold" style={{ color: "#8A784E" }}>
                  <i className="fas fa-star me-2"></i>Xếp hạng
                </Form.Label>
                <Form.Select
                  value={reviewData.rating}
                  onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
                  className="rounded-4"
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>{value} sao</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold" style={{ color: "#8A784E" }}>
                  <i className="fas fa-comment me-2"></i>Bình luận
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  className="rounded-4"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button
              variant="primary"
              className="rounded-4"
              onClick={handleReviewSubmit}
              disabled={!reviewData.rating}
            >
              <i className="fas fa-paper-plane me-2"></i>Gửi đánh giá
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </section>
  );
};

export default RentalHistory;