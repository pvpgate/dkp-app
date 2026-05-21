import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getEvent, deleteEvent, joinEvent } from "../api/event";

function EventPage({ initData }) {
  const { clanId, eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [canDelete, setCanDelete] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [participationStatus, setParticipationStatus] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePublicId, setDeletePublicId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initData || !clanId || !eventId) return;

    async function loadEvent() {
      const result = await getEvent(clanId, eventId, initData);

      if (result.ok) {
        setEvent(result.event);
        setCanDelete(result.can_delete);
        setIsParticipant(result.is_participant);
        setParticipationStatus(result.participation_status);
      }
    }

    loadEvent();
  }, [clanId, eventId, initData]);

  async function handleJoinEvent() {
    setError("");

    const result = await joinEvent(clanId, eventId, initData);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setIsParticipant(true);
    setParticipationStatus("pending");
  }

  async function handleDeleteEvent() {
    setError("");

    if (deletePublicId.toUpperCase() !== event.public_id) {
      setError("ID события введён неверно");
      return;
    }

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
          <button onClick={() => setShowDeleteConfirm(true)}>
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

          {!event.is_closed && !isParticipant && (
            <button onClick={handleJoinEvent}>
              Участвовать
            </button>
          )}

          {isParticipant && (
            <p>
              Ваш статус участия: {participationStatus}
            </p>
          )}
        </div>
      )}

      {showDeleteConfirm && event && (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            marginTop: 12,
          }}
        >
          <p>
            Вы уверены что хотите удалить событие? Для удаления введите ID
            события.
          </p>

          <input
            value={deletePublicId}
            onChange={(e) => setDeletePublicId(e.target.value)}
            placeholder="ID события"
          />

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 12,
              justifyContent: "center",
            }}
          >
            <button onClick={handleDeleteEvent}>
              Удалить
            </button>

            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeletePublicId("");
                setError("");
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </Layout>
  );
}

export default EventPage;