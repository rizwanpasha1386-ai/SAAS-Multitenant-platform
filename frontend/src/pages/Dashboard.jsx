import { useEffect, useState } from "react";

import API from "../api/axios";

import TenantCard from "../components/TenantCard";

function Dashboard() {
  const [tenants, setTenants] = useState([]);

  const [search, setSearch] = useState("");

  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(false);

  // CREATE TENANT STATES
  const [showForm, setShowForm] = useState(false);

  const [tenantName, setTenantName] = useState("");

  const [ownerName, setOwnerName] = useState("");

  const [creating, setCreating] = useState(false);

  // FETCH TENANTS
  const fetchTenants = async () => {
    try {
      setLoading(true);

      const res = await API.get("/tenant", {
        params: {
          search: search || undefined,
          role: role || undefined,
        },
      });

      setTenants(res.data.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // CREATE TENANT
  const createTenant = async () => {
    if (!tenantName || !ownerName) {
      return alert("All fields required");
    }

    try {
      setCreating(true);

      await API.post("/tenant", {
        name: tenantName,
        ownerName,
      });

      alert("Tenant created");

      setTenantName("");

      setOwnerName("");

      setShowForm(false);

      fetchTenants();

    } catch (err) {
      console.error(err);
      alert("Error creating tenant");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [search, role]);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <h1>Tenants Dashboard</h1>

      {/* SEARCH + FILTER */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search tenants..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          style={{ marginLeft: "10px" }}
        >
          <option value="">All Roles</option>

          <option value="owner">
            Owner
          </option>

          <option value="admin">
            Admin
          </option>

          <option value="member">
            Member
          </option>
        </select>
      </div>

      {/* CREATE TENANT BUTTON */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          {showForm
            ? "Cancel"
            : "Create Tenant"}
        </button>
      </div>

      {/* CREATE TENANT FORM */}
      {showForm && (
        <div
          style={{
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3>Create Tenant</h3>

          <input
            type="text"
            placeholder="Tenant Name"
            value={tenantName}
            onChange={(e) =>
              setTenantName(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e) =>
              setOwnerName(e.target.value)
            }
            style={{ marginLeft: "10px" }}
          />

          <button
            onClick={createTenant}
            disabled={creating}
            style={{ marginLeft: "10px" }}
          >
            {creating
              ? "Creating..."
              : "Submit"}
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* EMPTY */}
      {!loading &&
        tenants.length === 0 && (
          <p>No tenants found</p>
        )}

      {/* TENANTS */}
      <div>
        {tenants.map((tenant) => (
          <TenantCard
            key={tenant._id}
            tenant={tenant}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;