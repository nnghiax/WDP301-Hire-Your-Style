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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
              style={{ borderRadius: "8px", fontWeight: 500 }}
            >
              {error}
            </Alert>
          ) : deposits.length === 0 ? (
            <Alert
              variant="info"
              style={{ borderRadius: "8px", fontWeight: 500 }}
            >
              Không có giao dịch đặt cọc nào.
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
                  }}
                >
                  <tr>
                    <th style={{ padding: "15px" }}>Tên khách hàng</th>
                    <th style={{ padding: "15px" }}>Số điện thoại</th>
                    <th style={{ padding: "15px" }}>Địa chỉ</th>
                    <th style={{ padding: "15px" }}>Số tiền đặt cọc</th>
                    <th style={{ padding: "15px" }}>Ngày thuê</th>
                    <th style={{ padding: "15px" }}>Ngày trả</th>
                    <th style={{ padding: "15px" }}>Trạng thái</th>
                    <th style={{ padding: "15px" }}>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit) => (
                    <tr key={deposit._id}>
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
                        {/* Hiển thị trạng thái màu */}
                        <div
                          style={{
                            marginBottom:
                              deposit.status === "returned" ? "8px" : "0",
                          }}
                        >
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
                              display: "inline-block",
                              width: "100px",
                              textAlign: "center",
                            }}
                          >
                            {deposit.status}
                          </span>
                        </div>

                        {/* Nếu trạng thái là returned thì hiển thị nút riêng dòng */}
                        {deposit.status === "returned" && (
                          <div>
                            <button
                              onClick={() => handleUpdateStatus(deposit._id)}
                              style={{
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "8px",
                                fontSize: "0.8rem",
                                cursor: "pointer",
                                marginTop: "4px",
                              }}
                            >
                              Xác nhận hoàn tất
                            </button>
                          </div>
                        )}
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
