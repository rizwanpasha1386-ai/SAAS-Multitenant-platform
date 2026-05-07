import { useState } from "react";

import API from "../api/axios";

function AddMemberForm({
  tenantId,
  refreshData,
}) {
  const [memberId, setMemberId] = useState("");

  const addMember = async () => {
    try {
      await API.post(
        `/tenant/${tenantId}/add-members`,
        {
          emails: [memberId],
        }
      );

      alert("Member added");

      setMemberId("");

      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <input
        type="text"
        placeholder="User ID"
        value={memberId}
        onChange={(e) =>
          setMemberId(e.target.value)
        }
      />

      <button onClick={addMember}>
        Add Member
      </button>
    </div>
  );
}

export default AddMemberForm;