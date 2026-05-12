const API_URL = "https://generous-joy-production-87dc.up.railway.app";

export async function changeMemberRole(clanId, memberId, initData, role) {
  const response = await fetch(`${API_URL}/clans/${clanId}/members/${memberId}/role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      initData,
      role,
    }),
  });

  return response.json();
}