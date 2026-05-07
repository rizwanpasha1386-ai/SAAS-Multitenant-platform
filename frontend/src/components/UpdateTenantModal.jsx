import { useState } from "react";

import API from "../api/axios";

function UpdateTenantModal({
  tenant,
  refreshData,
}) {
  const [name, setName] = useState(tenant.name);

  const updateTenant = async () => {
    try {
      await API.patch(`/tenant/${tenant._id}`,
      {
        name,
      });

      alert("Tenant updated");

      refreshData();
    } catch (err) {
      console.error(err.response);
    }
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <input
        type="text"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <button onClick={updateTenant}>
        Update Tenant
      </button>
    </div>
  );
}

export default UpdateTenantModal;