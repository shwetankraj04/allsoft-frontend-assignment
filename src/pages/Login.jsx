import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // for redirect

  const handleGenerateOtp = async () => {
    try {
      const res = await fetch(
        "https://apis.allsoft.co/api/documentManagement/generateOTP",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile_number: mobile }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setMessage("OTP sent successfully!");
        console.log("Generate OTP Response:", data); // check API response
      } else {
        setMessage(data.message || "Error sending OTP");
      }
    } catch (err) {
      setMessage("Network error: " + err.message);
    }
  };

  const handleValidateOtp = async () => {
    try {
      const res = await fetch(
        "https://apis.allsoft.co/api/documentManagement/validateOTP",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile_number: mobile, otp }),
        }
      );
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setMessage("Login successful!");
        // Redirect to Upload page
        navigate("/upload");
      } else {
        setMessage(data.message || "Invalid OTP");
      }
    } catch (err) {
      setMessage("Network error: " + err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-4 text-center">Login with OTP</h3>

      {!otpSent ? (
        <>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <button
            className="btn btn-primary w-100"
            onClick={handleGenerateOtp}
            disabled={!mobile}
          >
            Generate OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            className="btn btn-success w-100"
            onClick={handleValidateOtp}
            disabled={!otp}
          >
            Validate OTP
          </button>
        </>
      )}

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
