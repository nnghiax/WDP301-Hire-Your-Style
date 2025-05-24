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
  registerButton: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "2rem",
    background: "linear-gradient(to right, #36d1dc, #5b86e5)",
    color: "#fff",
    border: "none",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
};

const RegisterPage = () => {
  return (
    <div style={styles.page}>
      <Card style={styles.card}>
        <Card.Title className="text-center mb-4">
          <h3>Register</h3>
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
          <Form.Label>Email</Form.Label>
          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Type your email"
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

        <Button style={styles.registerButton} className="mb-4">
          REGISTER
        </Button>
        <div className="text-center">
          <p className="text-muted mb-2">Already have an account?</p>
          <Link to="/login" style={styles.link}>
            LOGIN
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
