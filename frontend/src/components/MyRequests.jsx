import { useEffect, useState } from "react";
import { getMyRequests } from "../api/myRequests";

function MyRequests({ initData }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!initData) return;

    async function loadRequests() {
      const result = await getMyRequests(initData);

      if (result.ok) {
        setRequests(result.requests);
      }
    }

    loadRequests();
  }, [initData]);

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Ваши заявки:</h2>

      {requests.length === 0 ? (
        <p>Активных заявок нет</p>
      ) : (
        requests.map((request) => (
          <div
            key={request.id}
            style={{
              marginBottom: 12,
              padding: 12,
              border: "1px solid #ccc",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div>
              <div>
                <b>{request.clan_name}</b> #{request.clan_public_id}
              </div>

              <div>
                Ник: {request.game_nickname} | Статус: {request.status}
              </div>
            </div>

            <button>
              Отменить заявку
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default MyRequests;