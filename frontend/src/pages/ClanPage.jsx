import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getClan } from "../api/getClan";
import { deleteClan } from "../api/deleteClan";
import Layout from "../components/Layout";

function ClanPage({ initData }) {
  const { clanId } = useParams();
  const navigate = useNavigate();

  const [clan, setClan] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteName, setDeleteName] = useState("");
  const [error, setError] = useState("");

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

  return (
    <Layout>
      <div style={{marginBottom: 12, display: "flex", justifyContent: "flex-start",}}>
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

        {clan?.role === "leader" && (
          <button onClick={() => setShowDeleteConfirm(true)}>
            Delete clan
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
            Вы уверены что хотите удалить клан {clan.name}. Для удаления
            напишите название клана и нажмите подтвердить.
          </p>

          <input
            value={deleteName}
            onChange={(e) => setDeleteName(e.target.value)}
            placeholder="Название клана"
          />

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={handleDeleteClan}>
              Удалить
            </button>

            <button onClick={() => setShowDeleteConfirm(false)}>
              Отменить
            </button>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}

      <h2>Members</h2>

      <p>Members list will be here</p>
    </Layout>
  );
}

export default ClanPage;