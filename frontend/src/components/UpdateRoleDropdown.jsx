import API from "../api/axios";

function UpdateRoleDropdown({
  tenantId,
  member,
  refreshData,
}) {

  const updateRole = async (role) => {
    try {
      await API.patch(
        `/tenant/${tenantId}/role`,
        {
          memberId: member.user._id,
          role,
        }
      );

      alert("Role updated");

      refreshData();
    } catch (err) {
      console.error(err);
    }
  };
return (
    <select
      value={member.role}
      onChange={(e) =>
        updateRole(e.target.value)
      }
    >
      <option value="member">
        member
      </option>

      <option value="admin">
        admin
      </option>
    </select>
  );
}

export default UpdateRoleDropdown;