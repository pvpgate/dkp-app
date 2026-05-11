import { useEffect, useState } from "react";
import { getMyClans } from "../api/myClans";

function roleIcon(role) {
  if (role === "leader") return "👑";
  if (role === "officer") return "🛡️";
  return "👤";
}

function MyClans({ initData }) {
  const [clans, setClans] = useState([]);

  useEffect(() => {
    if (!initData) return;

    async function loadClans() {
      const result = await getMyClans(initData);

      if (result.ok) {
        setClans(result.clans);
      }
    }

    loadClans();
  }, [initData]);

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Ваши кланы:</h2>

      {clans.length === 0 ? (
        <p>Вы еще не состоите ни в одном клане</p>
      ) : (
        clans.map((clan) => (
          <div key={clan.id} style={{ marginBottom: 12 }}>
            <div>
              {roleIcon(clan.role)} <b>{clan.name}</b>
            </div>

            <div>
              Members: {clan.members_count} | DKP: {clan.dkp}
            </div>

            <div style={{ marginTop: 6 }}>
            {(clan.role === "leader" || clan.role === "officer") && (
                <button>
                Manage
                </button>
            )}

            {(clan.role === "member" || clan.role === "officer") && (
                <button style={{ marginLeft: 8 }}>
                Leave clan
                </button>
            )}
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default MyClans;