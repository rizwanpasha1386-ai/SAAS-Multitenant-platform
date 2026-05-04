import { useState } from "react";
import { loginUser } from "../api/auth.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await loginUser({ email, password });
      console.log(res.data);
      alert("Login successful");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;