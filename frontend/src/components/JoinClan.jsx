import { useState } from "react";
import { sendJoinClanRequest } from "../api/joinClanRequest";

function JoinClan({ initData }) {
  const [showForm, setShowForm] = useState(false);
  const [publicId, setPublicId] = useState("");
  const [gameNickname, setGameNickname] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSendRequest() {
    setError("");
    setSuccess("");

    const result = await sendJoinClanRequest(
      initData,
      publicId,
      gameNickname
    );

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setPublicId("");
    setGameNickname("");
    setShowForm(false);
    setSuccess("Заявка отправлена");
  }

  return (
    <div style={{ marginTop: 12 }}>
      <button onClick={() => setShowForm(true)}>
        Вступить в клан
      </button>

      {success && (
        <p style={{ color: "green" }}>
          {success}
        </p>
      )}

      {showForm && (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            marginTop: 12,
          }}
        >
          <p>
            Чтобы подать заявку в клан, введите ID клана и свой игровой ник
          </p>

          <div style={{ marginBottom: 8 }}>
            <input
              value={publicId}
              onChange={(e) => setPublicId(e.target.value)}
              placeholder="ID клана"
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
            <button onClick={handleSendRequest}>
              Подать заявку
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

export default JoinClan;