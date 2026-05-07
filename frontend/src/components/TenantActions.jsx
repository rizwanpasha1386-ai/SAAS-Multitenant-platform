import UpdateTenantModal from "./UpdateTenantModal";
import DeleteTenantModal from "./DeleteTenantModal";

function TenantActions({ tenant, refreshData }) {
  return (
    <div>
      <UpdateTenantModal
        tenant={tenant}
        refreshData={refreshData}
      />

      <DeleteTenantModal
        tenantId={tenant._id}
      />
    </div>
  );
}

export default TenantActions;