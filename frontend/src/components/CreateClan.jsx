import { useState } from "react";
import { createClan } from "../api/clans";

function CreateClan({ initData }) {
  const [clanName, setClanName] = useState("");
  const [createdClan, setCreatedClan] = useState(null);

  async function handleCreateClan() {
    const result = await createClan(initData, clanName);

    console.log("CLAN CREATED:", result);

    if (result.ok) {
      setCreatedClan(result.clan);
      setClanName("");
    }
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Create clan</h2>

      <input
        value={clanName}
        onChange={(e) => setClanName(e.target.value)}
        placeholder="Clan name"
      />

      <button onClick={handleCreateClan}>
        Create
      </button>

      {createdClan && (
        <div>
          <p>Created clan:</p>
          <p>{createdClan.name}</p>
          <p>ID: {createdClan.public_id}</p>
        </div>
      )}
    </div>
  );
}

export default CreateClan;