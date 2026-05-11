import { useEffect, useState } from "react";
import { getClanMembers } from "../api/clanMembers";

function roleIcon(role) {
  if (role === "leader") return "👑";
  if (role === "officer") return "🛡️";
  return "👤";
}

function ClanMembers({ clanId, initData }) {
  const [members, setMembers] = useState([]);

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
              padding: "8px 0",
              borderBottom: "1px solid #ddd",
            }}
          >
            <div>
              {roleIcon(member.role)} {member.game_nickname}
            </div>

            <div>
              DKP: {member.dkp}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ClanMembers;