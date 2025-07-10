import React, { useState, useEffect } from "react";
import { Container, Table, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import HeaderAdmin from "./HeaderAdmin";
import AdminSidebar from "./AdminSidebar";

const DepositDashboard = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Hàm để định dạng địa chỉ từ đối tượng thành chuỗi
  const formatAddress = (address) => {
    if (!address) return "N/A";
    const { street, ward, district, city } = address;
    return `${street}, ${ward}, ${district}, ${city}`;
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
              letterSpacing: "1px",
              transition: "all 0.3s ease",
            }}
          >
            Quản lý tiền đặt cọc
          </h2>
          {loading ? (
            <div className="text-center py-5">
              <Spinner
                animation="border"
                variant="primary"
                style={{ width: "3rem", height: "3rem" }}
              />
            </div>
          ) : error ? (
            <Alert
              variant="danger"
              style={{
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                fontWeight: 500,
              }}
            >
              {error}
            </Alert>
          ) : deposits.length === 0 ? (
            <Alert
              variant="info"
              style={{
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                fontWeight: 500,
              }}
            >
              Không có giao dịch đặt cọc nào.
            </Alert>
          ) : (
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                overflow: "hidden",
                padding: "20px",
              }}
            >
              <Table
                hover
                responsive
                style={{
                  borderCollapse: "separate",
                  borderSpacing: 0,
                  fontSize: "0.95rem",
                }}
              >
                <thead
                  style={{
                    backgroundColor: "#1e1e2f",
                    color: "#fff",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                  }}
                >
                  <tr>
                    <th style={{ padding: "15px", borderTopLeftRadius: "8px" }}>
                      Tên khách hàng
                    </th>
                    <th style={{ padding: "15px" }}>Số điện thoại</th>
                    <th style={{ padding: "15px" }}>Địa chỉ</th>
                    <th style={{ padding: "15px" }}>Số tiền đặt cọc</th>
                    <th style={{ padding: "15px" }}>Ngày thuê</th>
                    <th style={{ padding: "15px" }}>Ngày trả</th>
                    <th style={{ padding: "15px" }}>Trạng thái</th>
                    <th
                      style={{ padding: "15px", borderTopRightRadius: "8px" }}
                    >
                      Ngày tạo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit) => (
                    <tr
                      key={deposit._id}
                      style={{
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f8f9fa";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#fff";
                      }}
                    >
                      <td style={{ padding: "15px" }}>{deposit.name}</td>
                      <td style={{ padding: "15px" }}>{deposit.phone}</td>
                      <td style={{ padding: "15px" }}>
                        {formatAddress(deposit.address)}
                      </td>
                      <td
                        style={{
                          padding: "15px",
                          color: "#28a745",
                          fontWeight: "500",
                        }}
                      >
                        {deposit.depositAmount.toLocaleString()} VND
                      </td>
                      <td style={{ padding: "15px" }}>
                        {new Date(deposit.rentalDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td style={{ padding: "15px" }}>
                        {deposit.returnDate
                          ? new Date(deposit.returnDate).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Chưa trả"}
                      </td>
                      <td style={{ padding: "15px" }}>
                        <span
                          style={{
                            backgroundColor:
                              deposit.status === "completed"
                                ? "#28a745"
                                : "#dc3545",
                            color: "#fff",
                            padding: "5px 10px",
                            borderRadius: "12px",
                            fontSize: "0.85rem",
                          }}
                        >
                          {deposit.status}
                        </span>
                      </td>
                      <td style={{ padding: "15px" }}>
                        {new Date(deposit.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default DepositDashboard;
