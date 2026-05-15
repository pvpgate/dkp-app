import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getEvent } from "../api/event";

function EventPage({ initData }) {
  const { clanId, eventId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!initData || !clanId || !eventId) return;

    async function loadEvent() {
      const result = await getEvent(clanId, eventId, initData);

      if (result.ok) {
        setEvent(result.event);
      }
    }

    loadEvent();
  }, [clanId, eventId, initData]);

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
          to={`/clan/${clanId}`}
          style={{ textDecoration: "none" }}
        >
          ← Back
        </Link>
      </div>

      <h1>{event ? event.title : "Loading..."}</h1>

      {event && (
        <div>
          <p>Дата: {new Date(event.created_at).toLocaleDateString()}</p>
          <p>DKP: {event.dkp_reward}</p>
          <p>Статус: {event.is_closed ? "Закрыто" : "Открыто"}</p>
        </div>
      )}
    </Layout>
  );
}

export default EventPage;