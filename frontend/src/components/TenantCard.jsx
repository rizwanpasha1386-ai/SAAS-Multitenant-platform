import { useNavigate } from "react-router-dom";

function TenantCard({ tenant }) {
  const navigate = useNavigate();

  const getRoleColor = (role) => {
    switch (role) {
      case "owner":
        return "#28a745";

      case "admin":
        return "#007bff";

      case "member":
        return "#ffc107";

      default:
        return "#6c757d";
    }
  };

  return (
    <div
      onClick={() => navigate(`/tenant/${tenant._id}`)}
      style={{
        padding: "15px",
        marginBottom: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
    >
      <strong>{tenant.name}</strong>

      <span
        style={{
          backgroundColor: getRoleColor(tenant.role),
          color: tenant.role === "member" ? "black" : "white",
          padding: "5px 12px",
          borderRadius: "20px",
          textTransform: "capitalize",
        }}
      >
        {tenant.role}
      </span>
    </div>
  );
}

export default TenantCard;