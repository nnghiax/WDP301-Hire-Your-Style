import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Alert,
  Spinner,
  Form,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import axios from "axios";
import HeaderAdmin from "./HeaderAdmin";
import AdminSidebar from "./AdminSidebar";

const DepositDashboard = () => {
  const [deposits, setDeposits] = useState([]);
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentDeposits = filteredDeposits.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredDeposits.length / recordsPerPage);

  const statusDisplay = {
    pending: "Đang chờ",
    confirmed: "Đã xác nhận",
    received: "Đã nhận",
    returning: "Đang trả",
    returned: "Đã trả",
    completed: "Hoàn tất",
    cancelled: "Đã hủy",
  };

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:9999/apiDeposit/deposits",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDeposits(response.data.data);
        setFilteredDeposits(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Lỗi khi tải danh sách đặt cọc"
        );
        setLoading(false);
      }
    };
    fetchDeposits();
  }, []);

  useEffect(() => {
    let result = [...deposits];

    if (statusFilter !== "all") {
      result = result.filter((d) => d.status === statusFilter);
    }

    if (searchName.trim() !== "") {
      result = result.filter((d) =>
        d.name?.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchPhone.trim() !== "") {
      result = result.filter((d) =>
        d.phone?.toLowerCase().includes(searchPhone.toLowerCase())
      );
    }

    setFilteredDeposits(result);
    setCurrentPage(1); // Reset về trang đầu
  }, [statusFilter, searchName, searchPhone, deposits]);

  const formatAddress = (address) => {
    if (!address) return "N/A";
    const { street, ward, district, city } = address;
    return `${street}, ${ward}, ${district}, ${city}`;
  };

  const handleUpdateStatus = async (rentalId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:9999/apiDeposit/deposits/${rentalId}/status`,
        { newStatus: "completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDeposits((prev) =>
        prev.map((d) =>
          d._id === rentalId ? { ...d, status: "completed" } : d
        )
      );
    } catch (error) {
      alert(
        "Cập nhật trạng thái thất bại: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f4f7fa",
      }}
    >
      <AdminSidebar />
      <div style={{ flex: 1, marginLeft: "250px" }}>
        <HeaderAdmin />
        <Container className="mt-5" style={{ maxWidth: "1200px" }}>
          <h2
            style={{
              color: "#00d4ff",
              marginBottom: "30px",
              fontWeight: "bold",
              background: "linear-gradient(90deg, #00d4ff, #007bff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
              fontSize: "2rem",
            }}
          >
            Quản lý tiền đặt cọc
          </h2>

          <Row className="mb-4">
            <Col md={4}>
              <Form.Group controlId="statusFilter">
                <Form.Label>Lọc theo trạng thái</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Đang chờ</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="received">Đã nhận</option>
                  <option value="returning">Đang trả</option>
                  <option value="returned">Đã trả</option>
                  <option value="completed">Hoàn tất</option>
                  <option value="cancelled">Đã hủy</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="searchName">
                <Form.Label>Tìm theo tên khách hàng</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="searchPhone">
                <Form.Label>Tìm theo số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <Spinner
                animation="border"
                variant="primary"
                style={{ width: "3rem", height: "3rem" }}
              />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : currentDeposits.length === 0 ? (
            <Alert variant="info">
              Không có giao dịch đặt cọc nào phù hợp với bộ lọc.
            </Alert>
          ) : (
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                padding: "20px",
              }}
            >
              <Table hover responsive>
                <thead style={{ backgroundColor: "#1e1e2f", color: "#fff" }}>
                  <tr>
                    <th>Tên khách hàng</th>
                    <th>SĐT</th>
                    <th>Địa chỉ</th>
                    <th>Số tiền</th>
                    <th>Ngày thuê</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDeposits.map((deposit) => (
                    <tr key={deposit._id}>
                      <td>{deposit.name}</td>
                      <td>{deposit.phone}</td>
                      <td>{formatAddress(deposit.address)}</td>
                      <td style={{ color: "#28a745", fontWeight: "500" }}>
                        {deposit.depositAmount.toLocaleString()} VND
                      </td>
                      <td>
                        {new Date(deposit.rentalDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td>
                        <span
                          style={{
                            backgroundColor:
                              deposit.status === "completed"
                                ? "#28a745"
                                : deposit.status === "cancelled"
                                ? "#6c757d"
                                : deposit.status === "pending"
                                ? "#ffc107"
                                : "#dc3545",
                            color: "#fff",
                            padding: "5px 10px",
                            borderRadius: "12px",
                            fontSize: "0.85rem",
                            display: "inline-block",
                            width: "120px",
                            textAlign: "center",
                          }}
                        >
                          {statusDisplay[deposit.status] || deposit.status}
                        </span>
                        {deposit.status === "returned" && (
                          <div className="mt-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleUpdateStatus(deposit._id)}
                            >
                              Xác nhận hoàn tất
                            </Button>
                          </div>
                        )}
                      </td>
                      <td>
                        {new Date(deposit.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={
                        currentPage === i + 1 ? "primary" : "outline-primary"
                      }
                      className="me-2"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default DepositDashboard;
