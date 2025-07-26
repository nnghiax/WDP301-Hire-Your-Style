import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import "../css/Cart.css";
import AdminSidebar from "./AdminSidebar";

const RentalDashboard = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({}); // Lưu số điện thoại theo userId

  const fetchRentalHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực");

      const response = await axios.get(
        "http://localhost:9999/rental/list/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Lọc các đơn hàng có status là 'reject'
      const rejectedRentals = (response.data.data || []).filter(
        (rental) => rental.status === "reject"
      );

      setRentals(rejectedRentals);

      // Lấy số điện thoại cho từng userId (tránh trùng lặp)
      const uniqueUserIds = [
        ...new Set(rejectedRentals.map((rental) => rental.userId)),
      ];
      const userInfoPromises = uniqueUserIds.map((userId) =>
        fetchUserInfo(userId)
      );
      await Promise.all(userInfoPromises);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async (userId) => {
    if (!userId || userInfo[userId]) return; // Bỏ qua nếu không có userId hoặc đã có thông tin
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực");

      const response = await axios.get(
        `http://localhost:9999/user/profile/admin/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserInfo((prev) => ({
        ...prev,
        [userId]: {
          phone: response.data.data.phone || null,
        },
      }));
    } catch (err) {
      setUserInfo((prev) => ({
        ...prev,
        [userId]: { phone: null },
      }));
      console.error(
        "Lỗi khi lấy số điện thoại người dùng:",
        err.response?.data?.message || err.message
      );
    }
  };

  const handleUpdateStatus = async (rentalId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:9999/rental/update-status/${rentalId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Cập nhật trạng thái thành công:", response.data);
      alert("Cập nhật trạng thái thành công!");
      fetchRentalHistory();
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật trạng thái:",
        error.response?.data || error.message
      );
      alert("Cập nhật trạng thái thất bại!");
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
      reject: "badge bg-danger",
    };
    const statusText = {
      pending: "Đang chờ",
      confirmed: "Đã xác nhận",
      cancelled: "Đã hủy",
      completed: "Hoàn thành",
      reject: "Đã từ chối nhận hàng",
    };
    return (
      <Badge
        className={statusClasses[status]}
        style={{ borderRadius: "0.5rem", padding: "0.4rem 0.8rem" }}
      >
        {statusText[status] || status}
      </Badge>
    );
  };

  useEffect(() => {
    fetchRentalHistory();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <div style={{ marginLeft: "250px", padding: "30px", width: "100%" }}>
          <Container className="text-center py-5">
            <div
              className="spinner-border"
              style={{ color: "#8A784E" }}
              role="status"
            >
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <div style={{ marginLeft: "250px", padding: "30px", width: "100%" }}>
          <Container className="py-5">
            <Alert variant="danger" className="rounded-4 text-center">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div
        style={{
          marginLeft: "250px",
          width: "100%",
          padding: "30px",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        <h1 className="text-center mb-4">Danh Sách Đơn Hàng Bị Từ Chối</h1>

        {rentals.length === 0 ? (
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="text-center py-5">
              <h4>Chưa có đơn hàng bị từ chối nào</h4>
              <p className="text-muted">
                Không có đơn hàng nào bị từ chối tại thời điểm này.
              </p>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            <Col lg={12}>
              {rentals.map((rental) => (
                <Card
                  key={rental._id}
                  className="border-0 shadow-sm rounded-4 mb-4"
                >
                  <Card.Header
                    className="d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: "#f1f1f0" }}
                  >
                    <div>
                      <strong>Mã đơn thuê: {rental._id}</strong>
                      <span className="ms-3">
                        {getStatusBadge(rental.status)}
                      </span>
                    </div>
                    <div className="text-muted">
                      <small>Ngày tạo: {formatDate(rental.createdAt)}</small>
                    </div>
                  </Card.Header>

                  <Card.Body>
                    <Row className="mb-3">
                      <Col md={6}>
                        <p>
                          <strong>Ngày thuê:</strong>{" "}
                          {formatDate(rental.rentalDate)}
                        </p>
                        <p>
                          <strong>Ngày trả:</strong>{" "}
                          {formatDate(rental.returnDate)}
                        </p>
                        <p>
                          <strong>Số điện thoại:</strong>{" "}
                          {userInfo[rental.userId]?.phone ? (
                            userInfo[rental.userId].phone
                          ) : (
                            <span className="text-muted">
                              Không có số điện thoại
                            </span>
                          )}
                        </p>
                      </Col>
                      <Col md={6}>
                        <p>
                          <strong>Tổng tiền:</strong>{" "}
                          {formatPrice(rental.totalAmount)}
                        </p>
                        <p>
                          <strong>Tiền cọc:</strong>{" "}
                          {formatPrice(rental.depositAmount)}
                        </p>
                      </Col>
                    </Row>

                    <h5 className="mb-3">Sản phẩm đã thuê:</h5>
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
                              (new Date(rental.returnDate) -
                                new Date(rental.rentalDate)) /
                                (1000 * 60 * 60 * 24)
                            );
                            const itemTotal =
                              (product.price || 0) * item.quantity * rentalDays;

                            return (
                              <tr key={index}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img
                                      src={
                                        product.image ||
                                        `https://picsum.photos/80?random=${index}`
                                      }
                                      alt={product.name}
                                      className="img-thumbnail me-3 rounded-4"
                                      style={{
                                        width: "60px",
                                        height: "80px",
                                        objectFit: "cover",
                                      }}
                                    />
                                    <div>
                                      <h6 className="mb-0 fw-semibold">
                                        {product.name}
                                      </h6>
                                      <small className="text-muted">
                                        {product.category}
                                      </small>
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
                    {rental.status === "reject" && (
                      <Button
                        variant="danger"
                        className="rounded-4 me-2"
                        onClick={() => {
                          handleUpdateStatus(rental._id, "cancelled");
                        }}
                      >
                        đã trả lại tiền
                      </Button>
                    )}
                  </Card.Footer>
                </Card>
              ))}
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default RentalDashboard;
