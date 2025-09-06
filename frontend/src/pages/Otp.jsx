import React, { useState, useRef, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtpFunction, resetPasswordFunction } from "../services/Apis"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const Otp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [step, setStep] = useState(1); // 1: verify OTP, 2: reset password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const inputRefs = useRef([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      
      // Focus the next empty input or the last input
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  // Verify OTP
  const verifyOTP = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join("");
    
    if (otpString === "") {
      toast.error("Enter Your OTP")
    } else if (!/^\d+$/.test(otpString)) {
      toast.error("Enter Valid OTP")
    } else if (otpString.length < 6) {
      toast.error("OTP Length minimum 6 digits")
    } else {
      setLoading(true);
      const data = {
        otp: otpString, 
        email: location.state
      }

      try {
        const response = await verifyOtpFunction(data);
        if (response.data && response.data.success) {
          toast.success("OTP verified successfully!");
          setStep(2); // Move to password reset step
        } else {
          toast.error(response.data?.message || "Invalid OTP");
        }
      } catch (error) {
        console.error('OTP verification error:', error);
        toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  }

  // Reset Password
  const resetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword === "") {
      toast.error("Enter New Password");
    } else if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
    } else if (confirmPassword === "") {
      toast.error("Confirm Your Password");
    } else if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      setLoading(true);
      const data = {
        email: location.state,
        otp: otp.join(""),
        newPassword: newPassword
      }

      try {
        const response = await resetPasswordFunction(data);
        if (response.data && response.data.success) {
          toast.success("Password reset successfully!");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          toast.error(response.data?.message || "Password reset failed");
        }
      } catch (error) {
        console.error('Password reset error:', error);
        toast.error(error.response?.data?.message || "Password reset failed");
      } finally {
        setLoading(false);
      }
    }
  }

  const resendOTP = () => {
    setTimeLeft(300);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    toast.success("OTP resent successfully!");
  };

  return (
    <>
      <div className="otp-container">
        <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">
          <Row className="w-100 justify-content-center">
            <Col xs={12} sm={10} md={8} lg={6} xl={5} xxl={4}>
              <Card className="otp-card shadow-lg border-0">
                <Card.Body className="p-5">
                  {/* Logo Section */}
                  <div className="text-center mb-4">
                    <div className="logo-container mb-3">
                      <span className="logo-circle">○</span>
                      <span className="logo-text">circle</span>
                    </div>
                    <div className="verification-badge">
                      <span className="badge-text">Email Verification 📧</span>
                    </div>
                  </div>

                  {/* Form Header */}
                  <div className="form-header text-center mb-4">
                    <h2 className="form-title">
                      {step === 1 ? "Enter OTP" : "Reset Password"}
                    </h2>
                    <p className="form-subtitle">
                      {step === 1 ? (
                        <>
                          We've sent a 6-digit verification code to<br />
                          <strong>{location.state}</strong>
                        </>
                      ) : (
                        "Enter your new password"
                      )}
                    </p>
                  </div>

                  {/* OTP Input */}
                  <Form onSubmit={step === 1 ? verifyOTP : resetPassword}>
                    {step === 1 ? (
                      <div className="otp-input-container mb-4">
                        {otp.map((digit, index) => (
                          <Form.Control
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="otp-input"
                            maxLength="1"
                            autoComplete="off"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="password-fields mb-4">
                        <Form.Group className="mb-3">
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="password-input"
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="password-input"
                          />
                        </Form.Group>
                      </div>
                    )}

                    {/* Timer - Only show for OTP step */}
                    {step === 1 && (
                      <div className="timer-container text-center mb-4">
                        <div className="timer-display">
                          <span className="timer-icon">⏰</span>
                          <span className="timer-text">
                            {timeLeft > 0 ? formatTime(timeLeft) : "Time expired"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="verify-button w-100 mb-4"
                      size="lg"
                      disabled={loading || (step === 1 && otp.join("").length < 6) || (step === 2 && (!newPassword || !confirmPassword))}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          {step === 1 ? "Verifying..." : "Resetting..."}
                        </>
                      ) : (
                        <>
                          <span className="me-2">✓</span>
                          {step === 1 ? "Verify OTP" : "Reset Password"}
                        </>
                      )}
                    </Button>

                    {/* Resend Section - Only show for OTP step */}
                    {step === 1 && (
                      <div className="resend-section text-center">
                        <p className="mb-2">Didn't receive the code?</p>
                        <Button
                          variant="link"
                          className="resend-button"
                          onClick={resendOTP}
                          disabled={timeLeft > 0}
                        >
                          {timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : 'Resend OTP'}
                        </Button>
                      </div>
                    )}
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>

      <style jsx>{`
        .otp-container {
          position: relative;
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        .otp-card {
          background: white;
          border-radius: 20px;
          position: relative;
          z-index: 1;
          border: 1px solid #e9ecef;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .logo-circle {
          font-size: 2rem;
          color: #007bff;
          font-weight: bold;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }

        .verification-badge {
          display: inline-block;
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .form-header {
          margin-bottom: 2rem;
        }

        .form-title {
          color: #333;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .form-subtitle {
          color: #666;
          font-size: 0.95rem;
          margin-bottom: 0;
        }

        .otp-input-container {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .otp-input {
          width: 50px;
          height: 60px;
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          transition: all 0.3s ease;
          background: white;
        }

        .otp-input:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
          outline: none;
        }

        .password-fields {
          max-width: 400px;
          margin: 0 auto;
        }

        .password-input {
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .password-input:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
          outline: none;
        }

        .timer-container {
          margin-bottom: 1.5rem;
        }

        .timer-display {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 123, 255, 0.1);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #007bff;
        }

        .timer-icon {
          font-size: 1rem;
        }

        .verify-button {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .verify-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
        }

        .verify-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .resend-section p {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .resend-button {
          color: #007bff;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 0;
          border: none;
          background: none;
          transition: all 0.3s ease;
        }

        .resend-button:hover:not(:disabled) {
          color: #0056b3;
          text-decoration: underline;
        }

        .resend-button:disabled {
          color: #999;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .otp-card .card-body {
            padding: 2rem !important;
          }
          
          .form-title {
            font-size: 1.5rem;
          }
          
          .logo-circle {
            font-size: 1.5rem;
          }
          
          .logo-text {
            font-size: 1.2rem;
          }
          
          .otp-input {
            width: 45px;
            height: 55px;
            font-size: 1.3rem;
          }
          
          .otp-input-container {
            gap: 8px;
          }
        }
      `}</style>
    </>
  )
}

export default Otp