import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Cart.css"; // Import your custom CSS for styling
import { useNavigate } from "react-router-dom";

const ShoppingCart = ({ userId }) => {
  const [cartData, setCartData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // Lưu toàn bộ item object
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")) || userId;
  // Thêm state cho rental dates
  const [rentalDate, setRentalDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const navigate = useNavigate();
  // Tính số ngày thuê
  const getRentalDays = () => {
    if (!rentalDate || !returnDate) return 0;
    const start = new Date(rentalDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const fetchCartData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực");

      const response = await axios.get("http://localhost:9999/cart/list", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data.data || response.data || [];
      setCartData(data);
      setSelectedItems(data); // chọn tất cả items (toàn bộ object) mặc định
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setCartData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực");

      const response = await axios.get("http://localhost:9999/store/listall", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data.data || response.data || [];
      setStoreData(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setStoreData([]);
    } finally {
      setLoading(false);
    }
  };

  console.log("Cart Data:", cartData);
  console.log("selectedItems:", selectedItems);

  const handleCheckboxChange = (item) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some(
        (selectedItem) => selectedItem._id === item._id
      );
      if (isSelected) {
        return prev.filter((selectedItem) => selectedItem._id !== item._id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...cartData]); // Lưu toàn bộ items object
    }
  };

  const getItemTotal = (item) => {
    const rentalDays = getRentalDays();
    const dailyPrice = item.price || 0;
    const totalDays = rentalDays > 0 ? rentalDays : 1; // Ít nhất 1 ngày
    return item.quantity * dailyPrice * totalDays;
  };

  const getSubtotal = () => {
    return selectedItems.reduce((total, item) => {
      return total + getItemTotal(item);
    }, 0);
  };

  const subtotal = getSubtotal();
  const shipping = 0;
  const total = subtotal + shipping;

  // const tempRental = new URLSearchParams({
  //   userId: user._id,
  //   items: JSON.stringify(selectedItems), // ✅ Chuyển mảng thành chuỗi
  //   rentalDate: rentalDate,
  //   returnDate: returnDate,
  //   totalAmount: total.toString(),
  //   depositAmount: Math.round(total * 0.5).toString(),
  //   paymentId: "", // null không được hỗ trợ trong URLSearchParams
  //   status: "pending",
  // });

  const tempRental = new URLSearchParams({
    userId: user._id,
    items: encodeURIComponent(JSON.stringify(selectedItems)), // ✅ encode an toàn hơn
    rentalDate,
    returnDate,
    totalAmount: total.toString(),
    depositAmount: Math.round(total * 0.5).toString(),
    status: "pending",
  });

  console.log("user:", user._id);

  console.log("tempRental:", tempRental.toString());

  const handlePayment = async () => {
    if (selectedItems.length === 0 || !rentalDate || !returnDate) {
      alert("Vui lòng chọn sản phẩm và nhập ngày thuê/trả.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực");

      const orderData = {
        amount: Math.round(total),
        description: `HireYourStyle Thuê ${rentalDays} ngày`,
        orderCode: Date.now(),
        returnUrl: `http://localhost:5173/payment/success?${tempRental.toString()}`,
        cancelUrl: "http://localhost:3000/payment/cancel",
        selectedItems: selectedItems, // Gửi toàn bộ thông tin items đã chọn
        rentalDate,
        returnDate,
        rentalDays,
      };

      const response = await axios.post(
        "http://localhost:9999/payos",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Nếu tạo thành công, chuyển hướng đến trang thanh toán
      window.location.href = response.data.checkoutUrl;
    } catch (err) {
      console.error("Lỗi khi tạo link thanh toán:", err);
      setError(err.response?.data?.error || "Tạo link thanh toán thất bại");
    }
  };

  useEffect(() => {
    fetchCartData();
    fetchStoreData();
  }, [userId]);

  const updateQuantity = async (itemId, change) => {
    const item = cartData.find((item) => item._id === itemId);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + change);

    // Cập nhật cartData
    setCartData((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    // Cập nhật selectedItems nếu item đó đã được chọn
    setSelectedItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    await axios.put(
      `http://localhost:9999/cart/update-quantity/${itemId}`,
      { quantity: newQuantity },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  };

  // Hàm xử lý nhập số lượng trực tiếp
  const handleQuantityInputChange = async (itemId, value) => {
    const quantity = parseInt(value) || 1;
    const finalQuantity = Math.max(1, quantity);

    // Cập nhật cartData
    setCartData((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, quantity: finalQuantity } : item
      )
    );

    // Cập nhật selectedItems nếu item đó đã được chọn
    setSelectedItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, quantity: finalQuantity } : item
      )
    );

    try {
      await axios.put(
        `http://localhost:9999/cart/update-quantity/${itemId}`,
        { quantity: finalQuantity },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (itemId) => {
    setCartData((prev) => prev.filter((item) => item._id !== itemId));
    setSelectedItems((prev) => prev.filter((item) => item._id !== itemId));

    await axios.delete(`http://localhost:9999/cart/delete/${itemId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  if (loading) {
    return <div className="text-center">Đang tải giỏ hàng...</div>;
  }

  const rentalDays = getRentalDays();

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">
        <h1 className="text-center mb-4">Giỏ Hàng</h1>

        <div className="row">
          {/* DANH SÁCH SẢN PHẨM */}
          <div className="col-lg-8 mb-4">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  Sản phẩm ({cartData.length})
                  {rentalDays > 0 && (
                    <span className="text-muted ms-2">
                      - {rentalDays} ngày thuê
                    </span>
                  )}
                </h5>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleSelectAll}
                >
                  {selectedItems.length === cartData.length
                    ? "Bỏ chọn tất cả"
                    : "Chọn tất cả"}
                </button>
              </div>

              {cartData.length > 0 ? (
                <div className="card-body p-0">
                  {cartData.map((item, index) => (
                    <div
                      key={item._id}
                      className={`p-3 ${
                        index < cartData.length - 1 ? "border-bottom" : ""
                      }`}
                    >
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-check-input me-3"
                          checked={selectedItems.some(
                            (selectedItem) => selectedItem._id === item._id
                          )}
                          onChange={() => handleCheckboxChange(item)}
                        />
                        <img
                          src={
                            item.image ||
                            `https://picsum.photos/100?random=${index}`
                          }
                          alt={item.name}
                          className="img-thumbnail me-3"
                          style={{ width: "100px", height: "120px" }}
                        />
                        <div className="flex-grow-1">
                          <h6>{item.name}</h6>
                          <p className="mb-1 text-muted">
                            Store:{" "}
                            {storeData.find(
                              (store) => store._id === item.storeId
                            )?.name || "Không rõ"}
                          </p>
                          <p className="mb-1 text-muted">Size: {item.size}</p>
                          <div>
                            <strong>{formatPrice(item.price)}/ngày</strong>
                            {rentalDays > 0 && (
                              <div className="text-muted small">
                                {rentalDays} ngày × {formatPrice(item.price)} ={" "}
                                {formatPrice(item.price * rentalDays)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="me-3 d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => updateQuantity(item._id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="form-control mx-2 text-center"
                            style={{ width: "60px" }}
                            value={item.quantity}
                            min="1"
                            onChange={(e) =>
                              handleQuantityInputChange(
                                item._id,
                                e.target.value
                              )
                            }
                            onBlur={(e) => {
                              if (!e.target.value || e.target.value < 1) {
                                handleQuantityInputChange(item._id, "1");
                              }
                            }}
                          />
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => updateQuantity(item._id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <div className="me-3 text-end">
                          <strong>{formatPrice(getItemTotal(item))}</strong>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeItem(item._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card-body text-center">Giỏ hàng trống.</div>
              )}
            </div>
          </div>

          {/* TỔNG ĐƠN HÀNG + THỐNG KÊ */}
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-header">Tổng đơn hàng</div>
              <div className="card-body">
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginRight: "-0.75rem",
                    marginLeft: "-0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      flex: "0 0 50%",
                      maxWidth: "50%",
                      paddingRight: "0.75rem",
                      paddingLeft: "0.75rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <label
                      style={{ display: "block", marginBottom: "0.25rem" }}
                    >
                      Ngày thuê: *
                    </label>
                    <input
                      type="date"
                      value={rentalDate}
                      onChange={(e) => setRentalDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #dee2e6",
                        borderRadius: "0.5rem",
                        fontSize: "1rem",
                        marginTop: "0.25rem",
                        transition: "border-color 0.3s ease",
                        outline: "none",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#007bff";
                        e.target.style.boxShadow =
                          "0 0 5px rgba(0, 123, 255, 0.3)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#dee2e6";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  <div
                    style={{
                      flex: "0 0 50%",
                      maxWidth: "50%",
                      paddingRight: "0.75rem",
                      paddingLeft: "0.75rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <label
                      style={{ display: "block", marginBottom: "0.25rem" }}
                    >
                      Ngày trả: *
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={rentalDate || new Date().toISOString().split("T")[0]}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #dee2e6",
                        borderRadius: "0.5rem",
                        fontSize: "1rem",
                        marginTop: "0.25rem",
                        transition: "border-color 0.3s ease",
                        outline: "none",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#007bff";
                        e.target.style.boxShadow =
                          "0 0 5px rgba(0, 123, 255, 0.3)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#dee2e6";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {rentalDays > 0 && (
                  <div className="alert alert-info small mb-3">
                    <strong>Thời gian thuê:</strong> {rentalDays} ngày
                  </div>
                )}

                <p className="d-flex justify-content-between">
                  <span>Tạm tính:</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </p>
                <p className="d-flex justify-content-between">
                  <span>Phí vận chuyển:</span>
                  <strong>{formatPrice(shipping)}</strong>
                </p>
                <hr />
                <p className="d-flex justify-content-between">
                  <span>Tổng cộng:</span>
                  <strong className="text-success">{formatPrice(total)}</strong>
                </p>
                <p className="d-flex justify-content-between text-muted">
                  <span>Tiền cọc (50%):</span>
                  <span>{formatPrice(Math.round(total * 0.5))}</span>
                </p>
                <button
                  className={`btn btn-block ${
                    selectedItems.length === 0 || !rentalDate || !returnDate
                      ? "btn-secondary disabled"
                      : "btn-primary"
                  }`}
                  onClick={handlePayment}
                  disabled={
                    selectedItems.length === 0 || !rentalDate || !returnDate
                  }
                >
                  Thanh toán
                </button>
                <button
                  onClick={() =>
                    navigate(`/payment/success?${tempRental.toString()}`)
                  }
                >
                  test
                </button>
              </div>
            </div>

            {/* THỐNG KÊ */}
            <div className="card mb-4">
              <div className="card-header">Thống kê giỏ hàng</div>
              <div className="card-body text-center">
                <p>
                  <strong>{cartData.length}</strong> loại sản phẩm
                </p>
                <p>
                  <strong>
                    {cartData.reduce((sum, item) => sum + item.quantity, 0)}
                  </strong>{" "}
                  tổng số lượng
                </p>
                <p>
                  <strong>{selectedItems.length}</strong> sản phẩm đã chọn
                </p>
                <p>
                  <strong>
                    {selectedItems.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}
                  </strong>{" "}
                  số lượng đã chọn
                </p>
                {rentalDays > 0 && (
                  <p>
                    <strong>{rentalDays}</strong> ngày thuê
                  </p>
                )}
              </div>
            </div>

            {/* HÀNH ĐỘNG */}
            <div className="card">
              <div className="card-body text-center">
                <button className="btn btn-outline-primary btn-sm me-2">
                  <i className="fas fa-heart me-1"></i> Lưu giỏ hàng
                </button>
                <button className="btn btn-outline-secondary btn-sm me-2">
                  <i className="fas fa-share-alt me-1"></i> Chia sẻ
                </button>
                <button
                  className="btn btn-outline-info btn-sm"
                  onClick={fetchCartData}
                >
                  <i className="fas fa-sync-alt me-1"></i> Làm mới
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
