import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [tenants, setTenants] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTenants = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:8000/api/tenant", {
        params: {
          search: search || undefined,
          role: role || undefined,
        },
        withCredentials: true,
      });

      setTenants(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching tenants");
    } finally {
      setLoading(false);
    }
  };

  // initial load + filter changes
  useEffect(() => {
    fetchTenants();
  }, [search, role]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Tenants Dashboard</h1>

      {/* 🔍 FILTER BAR */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search tenants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>
      </div>

      {/* ⏳ Loading */}
      {loading && <p>Loading...</p>}

      {/* 📋 TENANTS LIST */}
      {!loading && tenants.length === 0 && <p>No tenants found</p>}

      <ul>
        {tenants.map((tenant) => (
          <li key={tenant._id}>
            <strong>{tenant.name}</strong> — {tenant.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;