import { useParams } from "react-router-dom";

function ClanPage() {
  const { clanId } = useParams();

  return (
    <div style={{ padding: 20 }}>
      <h1>Clan management</h1>
      <p>Clan ID: {clanId}</p>

      <button>
        Delete clan
      </button>

      <h2>Members</h2>
      <p>Members list will be here</p>
    </div>
  );
}

export default ClanPage;