import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getMemberInfo } from "../api/memberInfo";

function MemberPage({ initData }) {
  const { clanId, memberId } = useParams();
  const [member, setMember] = useState(null);

  useEffect(() => {
    if (!initData || !clanId || !memberId) return;

    async function loadMember() {
      const result = await getMemberInfo(clanId, memberId, initData);

      if (result.ok) {
        setMember(result.member);
      }
    }

    loadMember();
  }, [clanId, memberId, initData]);

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

      <h1>{member ? member.game_nickname : "Loading..."}</h1>

      {member && (
        <div>
          <p>Joined: {new Date(member.joined_at).toLocaleDateString()}</p>
          <p>Role: {member.role}</p>
          <p>DKP: {member.dkp}</p>
        </div>
      )}
    </Layout>
  );
}

export default MemberPage;