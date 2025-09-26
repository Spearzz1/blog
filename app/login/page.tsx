'use client';
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;
  setIsLoading(true);

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Login failed");

    toast.success("Login successful!");
    setTimeout(() => {
      router.push("/list"); // redirect to protected page
    }, 1000);

  } catch (err) {
    toast.error("Invalid email or password");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="login-container">
      <div className="login-background"></div>
      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <h1 className="brand-title">ANSONNE</h1>
            <span className="brand-subtitle">Admin Portal</span>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-input-container">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="login-button"
            >
              {isLoading ? (
                <div className="button-loading">
                  <div className="button-spinner"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Secure admin access to content management system</p>
          </div>
        </div>
      </div>

      <ToastContainer 
        position="top-right"
        toastClassName="toast-container"
        progressClassName="toast-progress"
      />

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          background: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .login-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 80%, rgba(0, 0, 0, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.02) 0%, transparent 50%);
          z-index: 0;
        }

        .login-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
          padding: 40px;
        }

        .login-card {
          background: #ffffff;
          border: 1px solid #f0f0f0;
          padding: 60px 40px;
          text-align: center;
        }

        .login-header {
          margin-bottom: 50px;
        }

        .brand-title {
          font-size: 2.2rem;
          font-weight: 300;
          letter-spacing: 4px;
          color: #000;
          margin: 0 0 8px 0;
        }

        .brand-subtitle {
          font-size: 0.75rem;
          color: #666;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          display: block;
        }

        .login-form {
          text-align: left;
        }

        .form-group {
          margin-bottom: 30px;
        }

        .form-label {
          display: block;
          font-size: 0.8rem;
          color: #000;
          font-weight: 500;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .form-input {
          width: 100%;
          padding: 12px 0;
          border: none;
          border-bottom: 1px solid #e0e0e0;
          background: transparent;
          font-size: 0.95rem;
          color: #000;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input:focus {
          border-bottom-color: #000;
        }

        .form-input.error {
          border-bottom-color: #dc2626;
        }

        .password-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-toggle {
          position: absolute;
          right: 0;
          background: none;
          border: none;
          font-size: 0.7rem;
          color: #666;
          cursor: pointer;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 4px 0;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: #000;
        }

        .error-message {
          display: block;
          font-size: 0.75rem;
          color: #dc2626;
          margin-top: 6px;
          letter-spacing: 0.3px;
        }

        .form-options {
          margin-bottom: 40px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 0.85rem;
          color: #666;
        }

        .checkbox-input {
          width: 16px;
          height: 16px;
          border: 1px solid #d0d0d0;
          margin-right: 10px;
          cursor: pointer;
          appearance: none;
          position: relative;
          transition: all 0.3s ease;
        }

        .checkbox-input:checked {
          background: #000;
          border-color: #000;
        }

        .checkbox-input:checked::after {
          content: '';
          position: absolute;
          left: 4px;
          top: 1px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .checkbox-text {
          letter-spacing: 0.3px;
        }

        .login-button {
          width: 100%;
          background: #000;
          color: white;
          border: none;
          padding: 14px;
          font-size: 0.85rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 30px;
          position: relative;
          overflow: hidden;
        }

        .login-button:hover:not(:disabled) {
          background: #333;
          transform: translateY(-1px);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .button-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .button-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .login-footer {
          border-top: 1px solid #f0f0f0;
          padding-top: 30px;
        }

        .login-footer p {
          font-size: 0.75rem;
          color: #999;
          letter-spacing: 0.3px;
          margin: 0;
          line-height: 1.5;
        }

        /* Toast Styles */
        :global(.Toastify__toast-container) {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        :global(.Toastify__toast) {
          background: #000;
          color: white;
          border-radius: 0;
          font-size: 0.8rem;
          letter-spacing: 0.3px;
        }

        :global(.Toastify__progress-bar) {
          background: rgba(255, 255, 255, 0.3);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .login-content {
            padding: 20px;
            max-width: 100%;
          }

          .login-card {
            padding: 40px 30px;
            border: none;
            box-shadow: 0 0 0 1px #f0f0f0;
          }

          .brand-title {
            font-size: 1.8rem;
            letter-spacing: 3px;
          }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 30px 20px;
          }

          .login-header {
            margin-bottom: 40px;
          }

          .form-group {
            margin-bottom: 25px;
          }
        }
      `}</style>
    </div>
  );
}
