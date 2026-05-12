import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClanMembers } from "../api/clanMembers";

function roleIcon(role) {
  if (role === "leader") return "👑";
  if (role === "officer") return "🛡️";
  return "👤";
}

function ClanMembers({ clanId, initData, currentUserRole }) {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!initData || !clanId) return;

    async function loadMembers() {
      const result = await getClanMembers(clanId, initData);

      if (result.ok) {
        setMembers(result.members);
      }
    }

    loadMembers();
  }, [clanId, initData]);

  return (
    <div>
      <h2>Members</h2>

      {members.length === 0 ? (
        <p>Участников пока нет</p>
      ) : (
        members.map((member, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #ddd",
            }}
          >
            <div>
              {roleIcon(member.role)} {member.game_nickname}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div>
                DKP: {member.dkp}
              </div>

              {(currentUserRole === "leader" || currentUserRole === "officer") && (
                <button
                  onClick={() =>
                    navigate(`/clan/${clanId}/member/${member.user_telegram_id}`)
                  }
                >
                  ⚙️
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ClanMembers;