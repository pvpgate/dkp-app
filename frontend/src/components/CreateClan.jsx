import { useState } from "react";
import { createClan } from "../api/clans";

function CreateClan({ initData, onClanCreated }) {
  const [clanName, setClanName] = useState("");
  const [createdClan, setCreatedClan] = useState(null);
  const [error, setError] = useState("");

  async function handleCreateClan() {
    setError("");

    const result = await createClan(initData, clanName);

    console.log("CLAN CREATED:", result);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setCreatedClan(result.clan);
    setClanName("");
    onClanCreated();
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

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

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