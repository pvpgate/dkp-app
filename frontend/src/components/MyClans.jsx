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
      <h2>My clans</h2>

      {clans.length === 0 ? (
        <p>You are not in any clans yet</p>
      ) : (
        clans.map((clan) => (
          <div key={clan.id} style={{ marginBottom: 12 }}>
            <div>
              {roleIcon(clan.role)} <b>{clan.name}</b>
            </div>

            <div>
              Members: {clan.members_count} | DKP: {clan.dkp}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyClans;