import { useEffect, useState } from "react";
import { getClanRequests } from "../api/clanRequests";
import { processRequest } from "../api/processRequest";

function ClanRequests({ clanId, initData }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!clanId || !initData) return;

    async function loadRequests() {
      const result = await getClanRequests(clanId, initData);

      if (result.ok) {
        setRequests(result.requests);
      }
    }

    loadRequests();
  }, [clanId, initData]);

  async function handleProcessRequest(requestId, action) {
    const result = await processRequest(requestId, initData, action);

    if (result.ok) {
      setRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
    }
  }

  return (
    <div>
      <h2>Заявки</h2>

      {requests.length === 0 ? (
        <p>Активных заявок нет</p>
      ) : (
        requests.map((request) => (
          <div
            key={request.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              padding: "8px 0",
              borderBottom: "1px solid #ddd",
            }}
          >
            <div>
              {new Date(request.created_at).toLocaleDateString()} |{" "}
              {request.game_nickname}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => handleProcessRequest(request.id, "accept")}>
                Принять
              </button>

              <button onClick={() => handleProcessRequest(request.id, "reject")}>
                Отклонить
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ClanRequests;