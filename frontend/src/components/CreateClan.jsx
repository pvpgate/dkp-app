import { useState } from "react";
import { createClan } from "../api/clans";

function CreateClan({ initData, onClanCreated }) {
  const [showForm, setShowForm] = useState(false);
  const [clanName, setClanName] = useState("");
  const [gameNickname, setGameNickname] = useState("");
  const [error, setError] = useState("");

  async function handleCreateClan() {
    setError("");

    const result = await createClan(initData, clanName, gameNickname);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setClanName("");
    setGameNickname("");
    setShowForm(false);
    onClanCreated();
  }

  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={() => setShowForm(true)}>
        Создать клан
      </button>

      {showForm && (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            marginTop: 12,
          }}
        >
          <p>Введите название клана и свой игровой ник</p>

          <div style={{ marginBottom: 8 }}>
            <input
              value={clanName}
              onChange={(e) => setClanName(e.target.value)}
              placeholder="Название клана"
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <input
              value={gameNickname}
              onChange={(e) => setGameNickname(e.target.value)}
              placeholder="Игровой ник"
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              marginTop: 12,
            }}
          >
            <button onClick={handleCreateClan}>
              Создать
            </button>

            <button onClick={() => setShowForm(false)}>
              Отмена
            </button>
          </div>

          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default CreateClan;