import { useState, useEffect } from "react";
import { signupUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Live validations state
  const [validations, setValidations] = useState({
    nameLength: false,
    passLength: false,
    passPattern: false,
  });

  // Calculate live validations whenever form inputs change
  useEffect(() => {
    const isNameValid = formData.name.trim().length >= 3;
    const isPassLengthValid = formData.password.length >= 6 && formData.password.length <= 20;
    // Must contain at least one letter and one number
    const passPatternRegex = /^(?=.*[a-zA-Z])(?=.*\d)/;
    const isPassPatternValid = passPatternRegex.test(formData.password);

    setValidations({
      nameLength: isNameValid,
      passLength: isPassLengthValid,
      passPattern: isPassPatternValid,
    });
  }, [formData.name, formData.password]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid =
    validations.nameLength &&
    validations.passLength &&
    validations.passPattern &&
    formData.email.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError("Please satisfy all validation criteria first.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await signupUser(formData);
      console.log(res.data);
      setSuccess("Account created successfully! Redirecting to login...");
      
      // Auto-redirect after 1.5 seconds
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.msg || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us to manage your workspaces efficiently</p>
      </div>

      {error && (
        <div className="alert-banner error">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert-banner success">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="input-label" htmlFor="name">Full Name</label>
          <div className="input-wrapper">
            <input
              id="name"
              type="text"
              name="name"
              placeholder="e.g. John Doe"
              className="auth-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="input-label" htmlFor="email">Email Address</label>
          <div className="input-wrapper">
            <input
              id="email"
              type="email"
              name="email"
              placeholder="e.g. john@example.com"
              className="auth-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="input-label" htmlFor="password">Password</label>
          <div className="input-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                // Eye Off Icon
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                // Eye Icon
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {/* Validation Checklist UI */}
          {(formData.name.length > 0 || formData.password.length > 0) && (
            <ul className="validation-checklist">
              <li className={`validation-item ${validations.nameLength ? "valid" : "invalid"}`}>
                {validations.nameLength ? (
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                ) : (
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                )}
                Name has at least 3 characters
              </li>
              <li className={`validation-item ${validations.passLength ? "valid" : "invalid"}`}>
                {validations.passLength ? (
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                ) : (
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                )}
                Password is between 6 and 20 characters
              </li>
              <li className={`validation-item ${validations.passPattern ? "valid" : "invalid"}`}>
                {validations.passPattern ? (
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                ) : (
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                )}
                Password contains letters & numbers
              </li>
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="auth-btn"
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <>
              Sign Up
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? 
        <Link to="/login" className="auth-link">Log In</Link>
      </div>
    </div>
  );
}

export default Signup;