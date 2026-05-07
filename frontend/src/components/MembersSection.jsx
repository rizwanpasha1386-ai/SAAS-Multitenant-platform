import AddMemberForm from "./AddMemberForm";
import CreateAdminForm from "./CreateAdminForm";
import MembersTable from "./MembersTable";

function MembersSection({
  tenantId,
  members,
  refreshData,
}) {
  return (
    <div>
      <h2>Members</h2>

      <AddMemberForm
        tenantId={tenantId}
        refreshData={refreshData}
      />

      <CreateAdminForm
        tenantId={tenantId}
        refreshData={refreshData}
      />

      <MembersTable
        tenantId={tenantId}
        members={members}
        refreshData={refreshData}
      />
    </div>
  );
}

export default MembersSection;