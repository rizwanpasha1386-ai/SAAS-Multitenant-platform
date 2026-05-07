import API from "../api/axios";

import UpdateRoleDropdown from "./UpdateRoleDropdown";

function MembersTable({
  tenantId,
  members,
  refreshData,
}) {

  const removeMember = async (
    memberId
  ) => {
    try {
      await API.delete(
        `/tenant/${tenantId}/members/${memberId}`
      );

      alert("Member removed");

      refreshData();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {members.map((member) => (
          <tr key={member.user._id}>
            <td>{member.user.name}</td>

            <td>{member.user.email}</td>

            <td>{member.role}</td>

            <td>
              {member.role !== "owner" && (
                <>
                  <UpdateRoleDropdown
                    tenantId={tenantId}
                    member={member}
                    refreshData={refreshData}
                  />

                  <button
                    onClick={() =>
                      removeMember(
                        member.user._id
                      )
                    }
                  >
                    Remove
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MembersTable;