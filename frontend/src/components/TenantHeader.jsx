import TenantActions from "./TenantActions";

function TenantHeader({ tenant, refreshData }) {
  if (!tenant) {
    return null;
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h1>{tenant.name}</h1>

      <p>
        Created By: {tenant.createdBy?.name}
      </p>

      <p>
        Email: {tenant.createdBy?.email}
      </p>

      <TenantActions
        tenant={tenant}
        refreshData={refreshData}
      />
    </div>
  );
}

export default TenantHeader;