import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getMemberInfo } from "../api/memberInfo";
import { changeMemberRole } from "../api/changeMemberRole";
import { changeDkp } from "../api/changeDkp";

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

  const [showDkpForm, setShowDkpForm] = useState(false);
  const [dkpOperation, setDkpOperation] = useState("add");
  const [dkpAmount, setDkpAmount] = useState("");
  const [dkpReason, setDkpReason] = useState("");

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

  const canManageDkp =
    currentUserRole === "leader" || currentUserRole === "officer";

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

  async function handleChangeDkp() {
    setError("");

    const parsedAmount = Number(dkpAmount);

    if (!parsedAmount || parsedAmount <= 0) {
      setError("Введите положительное количество DKP");
      return;
    }

    const finalAmount =
      dkpOperation === "add" ? parsedAmount : -parsedAmount;

    const result = await changeDkp(
      clanId,
      memberId,
      initData,
      finalAmount,
      dkpReason
    );

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setMember((prev) => ({
      ...prev,
      dkp: result.dkp,
    }));

    setDkpAmount("");
    setDkpReason("");
    setDkpOperation("add");
    setShowDkpForm(false);
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
            </div>
          )}

          <p>
            DKP: {member.dkp}

            {canManageDkp && (
              <button
                style={{ marginLeft: 8 }}
                onClick={() => setShowDkpForm(true)}
              >
                Изменить DKP
              </button>
            )}
          </p>

          {showDkpForm && (
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <p>Изменить DKP</p>

              <div style={{ marginBottom: 8 }}>
                <select
                  value={dkpOperation}
                  onChange={(e) => setDkpOperation(e.target.value)}
                >
                  <option value="add">Добавить</option>
                  <option value="subtract">Отнять</option>
                </select>
              </div>

              <div style={{ marginBottom: 8 }}>
                <input
                  type="number"
                  value={dkpAmount}
                  onChange={(e) => setDkpAmount(e.target.value)}
                  placeholder="Количество DKP"
                />
              </div>

              <div style={{ marginBottom: 8 }}>
                <input
                  value={dkpReason}
                  onChange={(e) => setDkpReason(e.target.value)}
                  placeholder="Причина"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <button onClick={handleChangeDkp}>
                  Сохранить
                </button>

                <button onClick={() => setShowDkpForm(false)}>
                  Отмена
                </button>
              </div>
            </div>
          )}

          <p>Joined: {new Date(member.joined_at).toLocaleDateString()}</p>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </Layout>
  );
}

export default MemberPage;