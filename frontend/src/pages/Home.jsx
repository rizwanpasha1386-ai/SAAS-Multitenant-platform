import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        withCredentials: true,
      })
      .then(() => {
        navigate("/tenants"); // already logged in
      })
      .catch(() => {
        setLoading(false); // not logged in
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="welcome-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="auth-container welcome-container">
      <div className="auth-header">
        <h1 className="welcome-logo">Antigravity</h1>
        <p className="auth-subtitle">A state-of-the-art secure multi-tenant SAAS workspace</p>
      </div>

      <div className="welcome-buttons">
        <button className="auth-btn" onClick={() => navigate("/login")}>
          Sign In
        </button>
        <button className="welcome-btn-outline" onClick={() => navigate("/signup")}>
          Create Account
        </button>
      </div>
    </div>
  );
}

export default Home;