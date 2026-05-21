import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getEvent, deleteEvent } from "../api/event";

function EventPage({ initData }) {
  const { clanId, eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [canDelete, setCanDelete] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initData || !clanId || !eventId) return;

    async function loadEvent() {
      const result = await getEvent(clanId, eventId, initData);

      if (result.ok) {
        setEvent(result.event);
        setCanDelete(result.can_delete);
      }
    }

    loadEvent();
  }, [clanId, eventId, initData]);

  async function handleDeleteEvent() {
    setError("");

    const result = await deleteEvent(clanId, eventId, initData);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate(`/clan/${clanId}?tab=events`);
  }

  return (
    <Layout>
      <div
        style={{
          marginBottom: 12,
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Link
          to={`/clan/${clanId}?tab=events`}
          style={{ textDecoration: "none" }}
        >
          ← Back
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ margin: 0 }}>
          {event ? event.title : "Loading..."}
        </h1>

        {canDelete && (
          <button onClick={handleDeleteEvent}>
            Удалить событие
          </button>
        )}
      </div>

      {event && (
        <div>
          <p>ID: #{event.public_id}</p>
          <p>Дата: {new Date(event.created_at).toLocaleDateString()}</p>
          <p>DKP: {event.dkp_reward}</p>
          <p>Статус: {event.is_closed ? "Закрыто" : "Открыто"}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </Layout>
  );
}

export default EventPage;