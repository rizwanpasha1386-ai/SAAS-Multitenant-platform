import { useNavigate } from "react-router-dom";

import API from "../api/axios";

function DeleteTenantModal({ tenantId }) {
  const navigate = useNavigate();

  const deleteTenant = async () => {
    const confirmDelete = window.confirm(
      "Delete this tenant?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await API.delete(`/tenant/${tenantId}`);

      alert("Tenant deleted");

      navigate("/tenants");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={deleteTenant}>
      Delete Tenant
    </button>
  );
}

export default DeleteTenantModal;