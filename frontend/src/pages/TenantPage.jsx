import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../api/axios";

import TenantHeader from "../components/TenantHeader";
import MembersSection from "../components/MembersSection";

function TenantPage() {
  const { tenantId } = useParams();

  const [tenant, setTenant] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTenant = async () => {
    try {
      const res = await API.get(`/tenant/${tenantId}`);
      setTenant(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await API.get(
        `/tenant/${tenantId}/members`
      );

      setMembers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };
 const refreshData = async () => {
    setLoading(true);

    await fetchTenant();
    await fetchMembers();

    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <TenantHeader
        tenant={tenant}
        refreshData={refreshData}
      />

      <MembersSection
        tenantId={tenantId}
        members={members}
        refreshData={refreshData}
      />
    </div>
  );
}

export default TenantPage;