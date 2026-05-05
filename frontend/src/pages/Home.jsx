import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/auth/me", {
        withCredentials: true,
      })
      .then(() => {
        navigate("/tenants"); // already logged in
      })
      .catch(() => {
        setLoading(false); // not logged in
      });
  }, []);

  if (loading) return <div>Checking authentication...</div>;

  return (
    <div>
      <h1>Welcome</h1>
      <button onClick={() => navigate("/login")}>Login</button>
      <button onClick={() => navigate("/signup")}>Signup</button>
    </div>
  );
}

export default Home;