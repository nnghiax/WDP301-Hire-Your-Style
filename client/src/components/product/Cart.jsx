import React, { useState, useEffect } from "react";
import axios from "axios";

const ShoppingCart = ({ userId }) => {
  const [cartData, setCartData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      console.log("Token:", token);

      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const response = await axios.get("http://localhost:9999/cart/list", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response.data);
      setCartData(response.data.data || response.data || []);
    } catch (err) {
      console.error("Error fetching cart data:", err);
      if (err.response) {
        setError(
          `Lỗi server: ${err.response.status} - ${
            err.response.data.message || err.response.statusText
          }`
        );
      } else if (err.request) {
        setError(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
        );
      } else {
        setError(err.message);
      }
      setCartData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [userId]);

  // Get all items from cart
  const getAllItems = () => {
    return cartData || [];
  };

  // Format price - assuming price is included in the product data
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

  // Calculate item total
  const getItemTotal = (item) => {
    return item.quantity * (item.price || 0);
  };

  // Calculate subtotal
  const getSubtotal = () => {
    return getAllItems().reduce((total, item) => {
      return total + getItemTotal(item);
    }, 0);
  };

  // Update quantity
  const updateQuantity = async (itemId, change) => {
    try {
      const item = cartData.find((item) => item._id === itemId);
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + change);

      // Update locally first for better UX
      setCartData((prevData) =>
        prevData.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      // Then sync with backend using axios
      const response = await axios.put(
        `http://localhost:9999/cart/update-quantity/${itemId}`,
        { quantity: newQuantity }, // data object for axios
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Update quantity response:", response.data);
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Revert local changes if API call fails
      fetchCartData();
      // Optionally show error message to user
    }
  };

  // Remove item
  const removeItem = async (itemId) => {
    try {
      // Update locally first
      setCartData((prevData) => prevData.filter((item) => item._id !== itemId));

      // Then sync with backend using axios
      const response = await axios.delete(
        `http://localhost:9999/cart/delete/${itemId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Remove item response:", response.data);
    } catch (error) {
      console.error("Error removing item:", error);
      // Revert local changes if API call fails
      fetchCartData();
      // Optionally show error message to user
    }
  };

  const subtotal = getSubtotal();
  const shipping = 1;
  const total = subtotal + shipping;
  const items = getAllItems();

  // Loading state
  if (loading) {
    return (
      <div className="container-fluid bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <h5>Đang tải giỏ hàng...</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container-fluid bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="alert alert-danger">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Lỗi tải dữ liệu: {error}
              </div>
              <button className="btn btn-primary">
                <i className="fas fa-redo me-2"></i>
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">
        {/* Header */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="text-center">
              <h1 className="display-4 font-weight-bold text-primary mb-3">
                <i className="fas fa-shopping-cart me-3"></i>
                Giỏ Hàng
              </h1>
              <p className="lead text-muted">
                Quản lý các sản phẩm trong giỏ hàng của bạn
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Cart Items */}
          <div className="col-lg-8 mb-5">
            <div className="card shadow-sm border-0 rounded-lg overflow-hidden">
              <div className="card-header bg-gradient-primary text-white py-3">
                <h4 className="mb-0 font-weight-bold">
                  <i className="fas fa-list me-2"></i>
                  Sản Phẩm Trong Giỏ ({items.length} sản phẩm)
                </h4>
              </div>

              {items.length > 0 ? (
                <div className="card-body p-0">
                  {items.map((item, index) => (
                    <div
                      key={item._id}
                      className={`p-4 ${
                        index !== items.length - 1 ? "border-bottom" : ""
                      }`}
                    >
                      <div className="row align-items-center">
                        {/* Product Image */}
                        <div className="col-md-2 col-sm-3 mb-3 mb-md-0">
                          <img
                            src={
                              item.image ||
                              `https://picsum.photos/300/300?random=${
                                index + 1
                              }`
                            }
                            alt={item.name}
                            className="img-fluid rounded shadow-sm"
                            style={{ aspectRatio: "1/1", objectFit: "cover" }}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="col-md-4 col-sm-5 mb-3 mb-md-0">
                          <h5 className="font-weight-bold text-dark mb-2">
                            {item.name}
                          </h5>
                          <p className="text-muted mb-2">
                            <i className="fas fa-tag me-1"></i>
                            Size:{" "}
                            <span className="badge badge-secondary text-dark">
                              {item.size}
                            </span>
                          </p>
                          <h6 className="text-primary font-weight-bold">
                            {formatPrice(item.price)}
                          </h6>
                        </div>

                        {/* Quantity Controls */}
                        <div className="col-md-3 col-sm-4 mb-3 mb-md-0">
                          <div className="d-flex align-items-center justify-content-center">
                            <div
                              className="input-group"
                              style={{ maxWidth: "140px" }}
                            >
                              <div className="input-group-prepend">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => updateQuantity(item._id, -1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <i className="fas fa-minus"></i>
                                </button>
                              </div>
                              <input
                                type="text"
                                className="form-control text-center font-weight-bold"
                                value={item.quantity}
                                readOnly
                              />
                              <div className="input-group-append">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => updateQuantity(item._id, 1)}
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Item Total & Remove */}
                        <div className="col-md-3 text-center">
                          <h5 className="font-weight-bold text-success mb-3">
                            {formatPrice(getItemTotal(item))}
                          </h5>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeItem(item._id)}
                            title="Xóa sản phẩm"
                          >
                            <i className="fas fa-trash-alt me-1"></i>
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card-body text-center py-5">
                  <div className="text-muted mb-4">
                    <i className="fas fa-shopping-cart fa-4x mb-3 text-secondary"></i>
                    <h4 className="font-weight-bold">Giỏ hàng trống</h4>
                    <p className="lead">
                      Chưa có sản phẩm nào trong giỏ hàng của bạn
                    </p>
                  </div>
                  <button className="btn btn-primary btn-lg">
                    <i className="fas fa-arrow-left me-2"></i>
                    Tiếp tục mua sắm
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div
              className="card shadow-sm border-0 rounded-lg overflow-hidden"
              style={{
                position: "sticky",
                top: "20px",
                zIndex: 1000,
                background: "white",
              }}
            >
              <div className="card-header bg-gradient-success text-white py-3">
                <h4 className="mb-0 font-weight-bold">
                  <i className="fas fa-calculator me-2"></i>
                  Tổng Đơn Hàng
                </h4>
              </div>

              <div className="card-body">
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">Tạm tính:</span>
                    <span className="font-weight-bold h6 mb-0">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted">Phí vận chuyển:</span>
                    <span className="font-weight-bold h6 mb-0">
                      {formatPrice(shipping)}
                    </span>
                  </div>
                  <hr className="my-3" />
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 font-weight-bold text-dark">
                      Tổng cộng:
                    </span>
                    <span className="h4 font-weight-bold text-success">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <button
                  className={`btn btn-block py-3 font-weight-bold ${
                    items.length === 0
                      ? "btn-secondary disabled"
                      : "btn-primary"
                  }`}
                  disabled={items.length === 0}
                >
                  <i
                    className={`fas ${
                      items.length === 0 ? "fa-ban" : "fa-credit-card"
                    } me-2`}
                  ></i>
                  {items.length === 0
                    ? "Giỏ Hàng Trống"
                    : "Tiến Hành Thanh Toán"}
                </button>
              </div>
            </div>

            {/* Cart Statistics */}
            {items.length > 0 && (
              <div className="card shadow-sm border-0 rounded-lg mt-4">
                <div className="card-header bg-light border-bottom">
                  <h6 className="mb-0 font-weight-bold text-dark">
                    <i className="fas fa-chart-bar me-2 text-info"></i>
                    Thống Kê Giỏ Hàng
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-4">
                      <div className="p-2">
                        <i className="fas fa-boxes fa-2x text-primary mb-2"></i>
                        <h6 className="font-weight-bold">{items.length}</h6>
                        <small className="text-muted">Loại sản phẩm</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-2">
                        <i className="fas fa-shopping-bag fa-2x text-success mb-2"></i>
                        <h6 className="font-weight-bold">
                          {items.reduce((sum, item) => sum + item.quantity, 0)}
                        </h6>
                        <small className="text-muted">Tổng số lượng</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-2">
                        <i className="fas fa-clock fa-2x text-warning mb-2"></i>
                        <h6 className="font-weight-bold">Hôm nay</h6>
                        <small className="text-muted">Cập nhật lần cuối</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Actions */}
            <div className="card shadow-sm border-0 rounded-lg mt-4">
              <div className="card-body text-center">
                <button className="btn btn-outline-primary btn-sm mb-2 me-2">
                  <i className="fas fa-heart me-1"></i>
                  Lưu giỏ hàng
                </button>
                <button className="btn btn-outline-secondary btn-sm mb-2">
                  <i className="fas fa-share-alt me-1"></i>
                  Chia sẻ
                </button>
                <button
                  className="btn btn-outline-info btn-sm mb-2 ms-2"
                  onClick={fetchCartData}
                  title="Làm mới giỏ hàng"
                >
                  <i className="fas fa-sync-alt me-1"></i>
                  Làm mới
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        }
        .bg-gradient-success {
          background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
        }
        .card {
          transition: all 0.3s ease;
        }
        .card:hover {
          transform: translateY(-2px);
        }
        .btn {
          transition: all 0.3s ease;
        }
        .btn:hover {
          transform: translateY(-1px);
        }
        .sticky-top {
          position: sticky;
          top: 20px;
        }
        .spinner-border {
          width: 3rem;
          height: 3rem;
        }
        .cart-summary-sticky {
          position: -webkit-sticky;
          position: sticky;
          top: 20px;
          z-index: 1020;
        }
      `}</style>
    </div>
  );
};

export default ShoppingCart;
