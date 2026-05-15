import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getClan } from "../api/getClan";
import { deleteClan } from "../api/deleteClan";
import { leaveClan } from "../api/leaveClan";
import Layout from "../components/Layout";
import ClanMembers from "../components/ClanMembers";
import ClanRequests from "../components/ClanRequests";
import ClanEvents from "../components/ClanEvents";

function ClanPage({ initData }) {
  const { clanId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [clan, setClan] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteName, setDeleteName] = useState("");
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [leaveName, setLeaveName] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "members");

  const canViewRequests =
    clan?.role === "leader" || clan?.role === "officer";

  useEffect(() => {
    if (!initData) return;

    async function loadClan() {
      const result = await getClan(clanId, initData);

      if (result.ok) {
        setClan(result.clan);
      }
    }

    loadClan();
  }, [clanId, initData]);

  async function handleDeleteClan() {
    setError("");

    const result = await deleteClan(clanId, initData, deleteName);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate("/");
  }

  async function handleLeaveClan() {
    setError("");

    const result = await leaveClan(clanId, initData, leaveName);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate("/");
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
          to="/"
          style={{
            textDecoration: "none",
          }}
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
          {clan ? clan.name : "Loading..."}
        </h1>

        {clan?.role === "leader" ? (
          <button onClick={() => setShowDeleteConfirm(true)}>
            Удалить клан
          </button>
        ) : (
          <button onClick={() => setShowLeaveConfirm(true)}>
            Покинуть клан
          </button>
        )}

      </div>

      {showDeleteConfirm && clan && (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            marginBottom: 20,
          }}
        >
          <p>
            Вы уверены что хотите удалить клан {clan.name}? Все участники и
            накопленные ими ДКП будут удалены. Для удаления напишите название
            клана.
          </p>

          <input
            value={deleteName}
            onChange={(e) => setDeleteName(e.target.value)}
            placeholder="Название клана"
          />

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 12,
              justifyContent: "center",
            }}
          >
            <button onClick={handleDeleteClan}>
              Удалить
            </button>

            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeleteName("");
                setError("");
              }}
            >
              Отменить
            </button>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <button onClick={() => setActiveTab("members")}>
          Мемберы
        </button>

        <button onClick={() => setActiveTab("events")}>
          События
        </button>

        {canViewRequests && (
          <button onClick={() => setActiveTab("requests")}>
            Заявки
          </button>
        )}
      </div>

      {activeTab === "members" && (
        <ClanMembers
          clanId={clanId}
          initData={initData}
          currentUserRole={clan?.role}
        />
      )}

      {activeTab === "events" && (
        <ClanEvents
          clanId={clanId}
          initData={initData}
          currentUserRole={clan?.role}
        />
      )}

      {activeTab === "requests" && canViewRequests && (
        <ClanRequests
          clanId={clanId}
          initData={initData}
        />
      )}

      {showLeaveConfirm && clan && (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            marginTop: 12,
          }}
        >
          <p>
            Вы уверены что хотите покинуть клан {clan.name}? Все накопленные
            ДКП будут потеряны. Для выхода напишите название клана.
          </p>

          <input
            value={leaveName}
            onChange={(e) => setLeaveName(e.target.value)}
            placeholder="Название клана"
          />

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 12,
              justifyContent: "center",
            }}
          >
            <button onClick={handleLeaveClan}>
              Покинуть
            </button>

            <button
              onClick={() => {
                setShowLeaveConfirm(false);
                setLeaveName("");
                setError("");
              }}
            >
              Отмена
            </button>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </Layout>
  );
}

export default ClanPage;