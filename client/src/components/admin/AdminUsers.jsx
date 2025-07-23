import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
  Table,
  Form,
} from "react-bootstrap";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import HeaderAdmin from "./HeaderAdmin";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [storeOwnerCount, setStoreOwnerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchEmail, setSearchEmail] = useState("");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:9999/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const {
          totalUsers,
          customerCount,
          storeOwnerCount,
          users: userData,
        } = response.data.data;
        setTotalUsers(totalUsers);
        setCustomerCount(customerCount);
        setStoreOwnerCount(storeOwnerCount);
        setUsers(userData);
        setFilteredUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Không thể tải danh sách người dùng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let updatedUsers = [...users];

    if (roleFilter !== "all") {
      updatedUsers = updatedUsers.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      const isAvailable = statusFilter === "active";
      updatedUsers = updatedUsers.filter(
        (user) => user.isAvailable === isAvailable
      );
    }

    if (searchEmail.trim() !== "") {
      const keyword = searchEmail.toLowerCase();
      updatedUsers = updatedUsers.filter((user) =>
        user.email.toLowerCase().includes(keyword)
      );
    }

    setFilteredUsers(updatedUsers);
  }, [roleFilter, statusFilter, users, searchEmail]);

  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, statusFilter, searchEmail]);

  const toggleUserAvailability = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:9999/admin/users/availability",
        { userId, isAvailable: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isAvailable: !currentStatus } : user
        )
      );
    } catch (error) {
      setError("Không thể cập nhật trạng thái người dùng.");
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (error) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div
        style={{
          marginLeft: "250px",
          flexGrow: 1,
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        <HeaderAdmin />
        <Container fluid className="px-4 py-4">
          <Row className="mb-4">
            <Col>
              <h5 className="fw-bold">📋 Quản lý người dùng</h5>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>Tổng số người dùng</Card.Title>
                  <h3>{totalUsers}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>Số khách hàng</Card.Title>
                  <h3>{customerCount}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>Số chủ cửa hàng</Card.Title>
                  <h3>{storeOwnerCount}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={4}>
              <Form.Group controlId="searchEmail">
                <Form.Label>Tìm theo email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập email người dùng..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="roleFilter">
                <Form.Label>Lọc theo vai trò</Form.Label>
                <Form.Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Khách hàng</option>
                  <option value="store_owner">Chủ cửa hàng</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="statusFilter">
                <Form.Label>Lọc theo trạng thái</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Đã khóa</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>Danh sách người dùng</Card.Title>
                  {loading ? (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ height: "200px" }}
                    >
                      <Spinner animation="border" variant="primary" />
                      <div className="ms-2">Đang tải dữ liệu...</div>
                    </div>
                  ) : currentUsers.length === 0 ? (
                    <div className="text-center text-muted py-4">
                      Không có người dùng nào phù hợp với bộ lọc.
                    </div>
                  ) : (
                    <>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentUsers.map((user) => (
                            <tr key={user._id}>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{user.role}</td>
                              <td>
                                {user.isAvailable ? "Hoạt động" : "Đã khóa"}
                              </td>
                              <td>
                                <Button
                                  variant={
                                    user.isAvailable ? "danger" : "success"
                                  }
                                  onClick={() =>
                                    toggleUserAvailability(
                                      user._id,
                                      user.isAvailable
                                    )
                                  }
                                >
                                  {user.isAvailable ? "Khóa" : "Mở khóa"}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>

                      {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-3">
                          <div className="pagination">
                            {[...Array(totalPages).keys()].map((number) => (
                              <Button
                                key={number}
                                variant={
                                  number + 1 === currentPage
                                    ? "primary"
                                    : "outline-primary"
                                }
                                className="me-2"
                                onClick={() => handlePageChange(number + 1)}
                              >
                                {number + 1}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default AdminUsers;
