import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";

function MemberPage() {
  const { clanId, memberId } = useParams();

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

      <h1>Member page</h1>

      <p>Clan ID: {clanId}</p>
      <p>Member ID: {memberId}</p>
    </Layout>
  );
}

export default MemberPage;