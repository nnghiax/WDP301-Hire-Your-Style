import React from "react";
import { Card, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: `url('https://res.cloudinary.com/dj2liaz6d/image/upload/v1748015469/hfi8c2ljhjhz0u2vcacd.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  card: {
    borderRadius: "1rem",
    padding: "2rem",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #ced4da",
    marginBottom: "1.5rem",
  },
  inputIcon: {
    marginRight: "0.5rem",
    color: "#6c757d",
  },
  input: {
    border: "none",
    outline: "none",
    width: "100%",
    padding: "0.5rem 0",
  },
  loginButton: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "2rem",
    background: "linear-gradient(to right, #36d1dc, #5b86e5)",
    color: "#fff",
    border: "none",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  socialButton: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    border: "none",
    margin: "0 0.5rem",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
};

const LoginPage = () => {
  return (
    <div style={styles.page}>
      <Card style={styles.card}>
        <Card.Title className="text-center mb-4">
          <h3>Login</h3>
        </Card.Title>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Type your username"
              style={styles.input}
            />
          </div>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Type your password"
              style={styles.input}
            />
          </div>
        </Form.Group>

        <div className="text-end mb-4">
          <Link to="/forget-password" style={styles.link}>
            Forget password?
          </Link>
        </div>
        <Button style={styles.loginButton} className="mb-4">
          LOGIN
        </Button>
        <div className="text-center mb-4">
          <p className="text-muted">Or Sign Using</p>
          <div className="d-flex justify-content-center">
            <Button
              style={{
                ...styles.socialButton,
                backgroundColor: "#3b5998",
              }}
            >
              F
            </Button>
            <Button
              style={{
                ...styles.socialButton,
                backgroundColor: "#1da1f2",
              }}
            >
              T
            </Button>
            <Button
              style={{
                ...styles.socialButton,
                backgroundColor: "#db4437",
              }}
            >
              G
            </Button>
          </div>
        </div>

        <div className="text-center">
          <Link to="/register" style={styles.link}>
            SIGN UP
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
