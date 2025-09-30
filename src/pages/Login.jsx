import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";

export default function Login({ setToken }) {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleGetOtp = () => {
    setShowOtp(true);
    setAlertMsg("OTP sent successfully (demo mode).");
  };

  const handleValidateOtp = () => {
    if (otp.trim() === "") {
      setAlertMsg("Enter OTP");
      return;
    }

    // Demo mode token
    const demoToken = "demo-token";

    // Set token in App state
    setToken(demoToken);

    // Mark login success; useEffect will handle redirect
    setLoginSuccess(true);
  };

  // Redirect only when loginSuccess is true and token is set
  useEffect(() => {
    if (loginSuccess) {
      navigate("/upload");
    }
  }, [loginSuccess, navigate]);

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-3 text-center">Login</h3>
      {alertMsg && <Alert variant="info">{alertMsg}</Alert>}
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </Form.Group>
        <Button onClick={handleGetOtp}>Get OTP</Button>

        {showOtp && (
          <Form.Group className="mt-3">
            <Form.Label>Enter OTP</Form.Label>
            <Form.Control
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button className="mt-2" onClick={handleValidateOtp}>
              Validate OTP
            </Button>
          </Form.Group>
        )}
      </Form>
    </Container>
  );
}
