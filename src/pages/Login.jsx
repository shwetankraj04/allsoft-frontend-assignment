import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

export default function Login() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Generate OTP
  const handleGenerateOTP = async () => {
    setError("");
    setMessage("");
    try {
      const res = await axios.post(
        "https://apis.allsoft.co/api/documentManagement/generateOTP",
        { mobile_number: mobile }
      );
      if (res.data.status) {
        setMessage("OTP sent successfully.");
        setStep(2);
      } else {
        setError(res.data.data || "Failed to send OTP.");
      }
    } catch (err) {
      setError("Error while generating OTP.");
    }
  };

  // Validate OTP
  const handleValidateOTP = async () => {
    setError("");
    setMessage("");
    try {
      const res = await axios.post(
        "https://apis.allsoft.co/api/documentManagement/validateOTP",
        { mobile_number: mobile, otp }
      );

      if (res.data.status) {
        // Real token from backend
        localStorage.setItem("token", res.data.data.token);
        setMessage("Login successful!");
        navigate("/dashboard");
      } else {
        setError(res.data.data || "Invalid OTP.");
      }
    } catch (err) {
      setError("Error while validating OTP.");
    }
  };

  // Demo Login (frontend testing only)
  const handleDemoLogin = () => {
    localStorage.setItem("token", "dummy_token_for_assignment");
    setMessage("Demo login successful. Using dummy token.");
    navigate("/dashboard");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h3 className="mb-4 text-center">Login</h3>

          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          <Form>
            {step === 1 && (
              <>
                <Form.Group controlId="mobile">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </Form.Group>
                <Button className="mt-3 w-100" onClick={handleGenerateOTP}>
                  Get OTP
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <Form.Group controlId="otp">
                  <Form.Label>Enter OTP</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </Form.Group>
                <Button className="mt-3 w-100" onClick={handleValidateOTP}>
                  Validate OTP
                </Button>
              </>
            )}
          </Form>

          <hr />
          <Button
            variant="secondary"
            className="w-100 mt-2"
            onClick={handleDemoLogin}
          >
            Demo Login (Frontend Testing)
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
