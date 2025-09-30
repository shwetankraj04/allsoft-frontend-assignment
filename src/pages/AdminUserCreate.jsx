import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

export default function AdminUserCreate() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateUser = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage("Please enter both username and password.");
      return;
    }

    // Just save to localStorage (static mock, no API call)
    const users = JSON.parse(localStorage.getItem("adminUsers") || "[]");
    users.push({ username, password });
    localStorage.setItem("adminUsers", JSON.stringify(users));

    setMessage("User created successfully!");
    setUsername("");
    setPassword("");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h3 className="mb-4 text-center">Admin - Create User</h3>

          {message && <Alert variant="info">{message}</Alert>}

          <Form onSubmit={handleCreateUser}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Create User
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
