import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClan } from "../api/getClan";

function ClanPage() {
  const { clanId } = useParams();
  const [clan, setClan] = useState(null);

  useEffect(() => {
    async function loadClan() {
      const result = await getClan(clanId);

      if (result.ok) {
        setClan(result.clan);
      }
    }

    loadClan();
  }, [clanId]);

  return (
    <div style={{ padding: 20 }}>
      <h1>{clan ? clan.name : "Loading..."}</h1>

      <button>
        Delete clan
      </button>

      <h2>Members</h2>
      <p>Members list will be here</p>
    </div>
  );
}

export default ClanPage;