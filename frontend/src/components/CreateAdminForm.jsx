import { useState } from "react";

import API from "../api/axios";

function CreateAdminForm({
  tenantId,
  refreshData,
}) {
  const [email, setEmail] = useState("");

  const createAdmin = async () => {
    try {
      await API.post(
        `/tenant/${tenantId}/createAdmin`,
        {
          email,
        }
      );

      alert("Admin created");

      setEmail("");

      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Admin Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <button onClick={createAdmin}>
        Create Admin
      </button>
    </div>
  );
}

export default CreateAdminForm;