import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getMemberInfo } from "../api/memberInfo";

function roleLevel(role) {
  if (role === "leader") return 3;
  if (role === "officer") return 2;
  return 1;
}

function MemberPage({ initData }) {
  const { clanId, memberId } = useParams();
  const [member, setMember] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    if (!initData || !clanId || !memberId) return;

    async function loadMember() {
      const result = await getMemberInfo(clanId, memberId, initData);

      if (result.ok) {
        setMember(result.member);
        setCurrentUserRole(result.current_user_role);
      }
    }

    loadMember();
  }, [clanId, memberId, initData]);

  const canManageRole =
    member &&
    currentUserRole &&
    roleLevel(currentUserRole) > roleLevel(member.role);

  return (
    <Layout>
      <div
        style={{
          marginBottom: 12,
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Link
          to={`/clan/${clanId}`}
          style={{ textDecoration: "none" }}
        >
          ← Back
        </Link>
      </div>

      <h1>{member ? member.game_nickname : "Loading..."}</h1>

      {member && (
        <div>
          <p>
            Role: {member.role}

            {canManageRole && (
              <button style={{ marginLeft: 8 }}>
                Назначить роль
              </button>
            )}
          </p>

          <p>DKP: {member.dkp}</p>
          <p>Joined: {new Date(member.joined_at).toLocaleDateString()}</p>
        </div>
      )}
    </Layout>
  );
}

export default MemberPage;