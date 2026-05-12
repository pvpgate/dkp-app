import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getMemberInfo } from "../api/memberInfo";
import { changeMemberRole } from "../api/changeMemberRole";

function roleLevel(role) {
  if (role === "leader") return 3;
  if (role === "officer") return 2;
  return 1;
}

function MemberPage({ initData }) {
  const { clanId, memberId } = useParams();
  const [member, setMember] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [newRole, setNewRole] = useState("member");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initData || !clanId || !memberId) return;

    async function loadMember() {
      const result = await getMemberInfo(clanId, memberId, initData);

      if (result.ok) {
        setMember(result.member);
        setCurrentUserRole(result.current_user_role);
        setNewRole(result.member.role);
      }
    }

    loadMember();
  }, [clanId, memberId, initData]);

  const canManageRole =
    member &&
    currentUserRole &&
    roleLevel(currentUserRole) > roleLevel(member.role);

  async function handleChangeRole() {
    setError("");

    const result = await changeMemberRole(
      clanId,
      memberId,
      initData,
      newRole
    );

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setMember((prev) => ({
      ...prev,
      role: result.role,
    }));

    setShowRoleForm(false);
  }

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
              <button
                style={{ marginLeft: 8 }}
                onClick={() => setShowRoleForm(true)}
              >
                Назначить роль
              </button>
            )}
          </p>

          {showRoleForm && (
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <p>Выберите новую роль</p>

              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="member">member</option>

                {currentUserRole === "leader" && (
                  <option value="officer">officer</option>
                )}
              </select>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <button onClick={handleChangeRole}>
                  Сохранить
                </button>

                <button onClick={() => setShowRoleForm(false)}>
                  Отмена
                </button>
              </div>

              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          )}

          <p>DKP: {member.dkp}</p>
          <p>Joined: {new Date(member.joined_at).toLocaleDateString()}</p>
        </div>
      )}
    </Layout>
  );
}

export default MemberPage;