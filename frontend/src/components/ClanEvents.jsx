import { useEffect, useState } from "react";
import { getClanEvents, createEvent } from "../api/clanEvents";

function ClanEvents({ clanId, initData, currentUserRole }) {
  const [events, setEvents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [dkpReward, setDkpReward] = useState("");
  const [error, setError] = useState("");

  const canCreateEvent =
    currentUserRole === "leader" || currentUserRole === "officer";

  useEffect(() => {
    if (!clanId || !initData) return;

    async function loadEvents() {
      const result = await getClanEvents(clanId, initData);

      if (result.ok) {
        setEvents(result.events);
      }
    }

    loadEvents();
  }, [clanId, initData]);

  async function handleCreateEvent() {
    setError("");

    const result = await createEvent(
      clanId,
      initData,
      title,
      dkpReward
    );

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setEvents((prev) => [result.event, ...prev]);
    setTitle("");
    setDkpReward("");
    setShowCreateForm(false);
  }

  return (
    <div>
      <h2>События</h2>

      {canCreateEvent && (
        <button onClick={() => setShowCreateForm(true)}>
          Создать событие
        </button>
      )}

      {showCreateForm && (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            marginTop: 12,
            marginBottom: 12,
          }}
        >
          <p>Создать событие</p>

          <div style={{ marginBottom: 8 }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название события"
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <input
              type="number"
              value={dkpReward}
              onChange={(e) => setDkpReward(e.target.value)}
              placeholder="DKP за событие"
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 12,
              justifyContent: "center",
            }}
          >
            <button onClick={handleCreateEvent}>
              Создать
            </button>

            <button
              onClick={() => {
                setShowCreateForm(false);
                setTitle("");
                setDkpReward("");
                setError("");
              }}
            >
              Отмена
            </button>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}

      {events.length === 0 ? (
        <p>Событий пока нет</p>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            style={{
              marginTop: 12,
              padding: 12,
              border: "1px solid #ccc",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <b>{event.title}</b>{" "}
                <span style={{ color: "#777", fontSize: 14 }}>
                  ({new Date(event.created_at).toLocaleDateString()})
                </span>
            </div>

            <div>
              {event.dkp_reward} DKP
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ClanEvents;