import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Image, Alert, Card, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/ProfilePage.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState({
    street: "",
    ward: "",
    district: "",
    city: "",
  });
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:9999/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const userData = {
          ...res.data.data,
          avatar: res.data.data.avatar || "https://res.cloudinary.com/dh4vnrtg5/image/upload/v1747473243/avatar_user_orcdde.jpg",
        };
        setUser(userData);
        setName(userData.name);
        setAddress(userData.address || {
          street: "",
          ward: "",
          district: "",
          city: "",
        });
        setPhone(userData.phone || "");
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        setError("Không thể tải thông tin hồ sơ.");
      }
    };

    if (localStorage.getItem("token")) {
      fetchUser();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

 try {
      const formData = new FormData();
      if (name) formData.append("name", name);
      if (phone) formData.append("phone", String(phone)); 
      const hasAddressData = Object.values(address).some((value) => value.trim() !== "");
      if (hasAddressData) {
        formData.append("address", JSON.stringify(address));
      }
      if (avatar) formData.append("avatar", avatar);

      for (let [key, value] of formData.entries()) {
        console.log(`FormData ${key}: ${value}`);
      }

      const res = await axios.put("http://localhost:9999/user/update", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Update response:", res.data);

      setUser(res.data.data);
      setName(res.data.data.name);
      setAddress(res.data.data.address || {
        street: "",
        ward: "",
        district: "",
        city: "",
      });
      setPhone(res.data.data.phone || "");
      setAvatar(null);
      setSuccess("Cập nhật hồ sơ thành công!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Không thể cập nhật hồ sơ.");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    try {
      const res = await axios.post("http://localhost:9999/auth/change-password", passwordData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPasswordSuccess(res.data.message);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setShowPasswords({
        oldPassword: false,
        newPassword: false,
        confirmNewPassword: false,
      });
      setTimeout(() => setPasswordSuccess(""), 5000);
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError(error.response?.data?.message || "Không thể thay đổi mật khẩu.");
      setTimeout(() => setPasswordError(""), 5000);
    }
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  if (!user) {
    return <div className="text-center mt-5">Đang tải...</div>;
  }

  return (
    <div className="bg-white min-h-screen py-5" style={{ marginTop: '20px', color: '#1a202c', textAlign: 'left' }}>
      <Container className="main-body p-4">
        <div style={{ marginBottom: "1.5rem" }}>
          <a
            href="/"
            style={{
              color: "#8A784E",
              fontSize: "1.1rem",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            <i className="fas fa-home me-2" style={{ marginRight: "0.5rem" }}></i>
            Trang chủ
          </a>
        </div>

        <Row className="gutters-sm">
          <Col md={4} className="mb-3">
            <Card className="shadow-sm border">
              <Card.Body>
                <div className="d-flex flex-column align-items-center text-center">
                  <Image
                    src={avatar ? URL.createObjectURL(avatar) : user.avatar}
                    roundedCircle
                    width={150}
                    height={150}
                    alt="User Avatar"
                    className="object-cover"
                  />
                  <div className="mt-3">
                    <h4>{user.name}</h4>
                    <p className="text-muted">{`${address.street}, ${address.ward}, ${address.district}, ${address.city}`}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Card className="mb-3 shadow-sm border">
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Tên</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên của bạn"
                        className="mb-2"
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Email</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <Form.Control
                        type="email"
                        value={user.email}
                        readOnly
                        disabled
                        className="mb-2"
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Địa chỉ</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <Form.Control
                        type="text"
                        value={address.street}
                        onChange={(e) =>
                          setAddress({ ...address, street: e.target.value })
                        }
                        placeholder="Nhập số nhà, tên đường"
                        className="mb-2"
                      />
                      <Form.Control
                        type="text"
                        value={address.ward}
                        onChange={(e) =>
                          setAddress({ ...address, ward: e.target.value })
                        }
                        placeholder="Nhập phường/xã"
                        className="mb-2"
                      />
                      <Form.Control
                        type="text"
                        value={address.district}
                        onChange={(e) =>
                          setAddress({ ...address, district: e.target.value })
                        }
                        placeholder="Nhập quận/huyện"
                        className="mb-2"
                      />
                      <Form.Control
                        type="text"
                        value={address.city}
                        onChange={(e) =>
                          setAddress({ ...address, city: e.target.value })
                        }
                        placeholder="Nhập tỉnh/thành phố"
                        className="mb-2"
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Số điện thoại</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <Form.Control
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Nhập số điện thoại"
                        className="mb-2"
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Hình ảnh cá nhân</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="mb-2"
                      />
                    </div>
                  </div>
                  <div className="text-end">
                    <Button variant="info" type="submit">
                      Cập nhật hồ sơ
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <Card className="mb-3 shadow-sm border">
              <Card.Body>
                <h5 className="mb-4">Thay đổi mật khẩu</h5>
                {passwordError && <Alert variant="danger">{passwordError}</Alert>}
                {passwordSuccess && <Alert variant="success">{passwordSuccess}</Alert>}
                <Form onSubmit={handlePasswordSubmit}>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Mật khẩu cũ</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <InputGroup className="mb-2">
                        <Form.Control
                          type={showPasswords.oldPassword ? "text" : "password"}
                          name="oldPassword"
                          value={passwordData.oldPassword}
                          onChange={handlePasswordChange}
                          placeholder="Nhập mật khẩu cũ"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => toggleShowPassword("oldPassword")}
                        >
                          {showPasswords.oldPassword ? <EyeSlash /> : <Eye />}
                        </Button>
                      </InputGroup>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Mật khẩu mới</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <InputGroup className="mb-2">
                        <Form.Control
                          type={showPasswords.newPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Nhập mật khẩu mới"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => toggleShowPassword("newPassword")}
                        >
                          {showPasswords.newPassword ? <EyeSlash /> : <Eye />}
                        </Button>
                      </InputGroup>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Xác nhận mật khẩu mới</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <InputGroup className="mb-2">
                        <Form.Control
                          type={showPasswords.confirmNewPassword ? "text" : "password"}
                          name="confirmNewPassword"
                          value={passwordData.confirmNewPassword}
                          onChange={handlePasswordChange}
                          placeholder="Xác nhận mật khẩu mới"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => toggleShowPassword("confirmNewPassword")}
                        >
                          {showPasswords.confirmNewPassword ? <EyeSlash /> : <Eye />}
                        </Button>
                      </InputGroup>
                    </div>
                  </div>
                  <div className="text-end">
                    <Button variant="info" type="submit">
                      Thay đổi mật khẩu
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}