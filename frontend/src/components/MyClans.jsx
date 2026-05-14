import { useEffect, useState } from "react";
import { getMyClans } from "../api/myClans";
import { useNavigate } from "react-router-dom";

function roleIcon(role) {
  if (role === "leader") return "👑";
  if (role === "officer") return "🛡️";
  return "👤";
}

function MyClans({ initData, refreshKey }) {
  const [clans, setClans] = useState([]);
  const [hoveredClanId, setHoveredClanId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!initData) return;

    async function loadClans() {
      const result = await getMyClans(initData);

      if (result.ok) {
        setClans(result.clans);
      }
    }

    loadClans();
  }, [initData, refreshKey]);

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Ваши кланы:</h2>

      {clans.length === 0 ? (
        <p>Вы еще не состоите ни в одном клане</p>
      ) : (
        clans.map((clan) => (
          <div
            key={clan.id}
            onClick={() => navigate(`/clan/${clan.id}`)}
            onMouseEnter={() => setHoveredClanId(clan.id)}
            onMouseLeave={() => setHoveredClanId(null)}
            style={{
              marginBottom: 12,
              padding: 12,
              border: "1px solid #ccc",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              transition: "0.15s ease",
              backgroundColor:
                hoveredClanId === clan.id ? "#f5f5f5" : "transparent",
              transform:
                hoveredClanId === clan.id
                  ? "scale(1.01)"
                  : "scale(1)",
            }}
          >
            <div>
              <div>
                {roleIcon(clan.role)} <b>{clan.name}</b> #{clan.public_id}
              </div>

              <div>
                Members: {clan.members_count} | DKP: {clan.dkp}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyClans;