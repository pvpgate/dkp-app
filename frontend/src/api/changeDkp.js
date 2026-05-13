const API_URL = "https://generous-joy-production-87dc.up.railway.app";

export async function changeDkp(clanId, memberId, initData, amount, reason) {
  const response = await fetch(`${API_URL}/clans/${clanId}/members/${memberId}/dkp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      initData,
      amount,
      reason,
    }),
  });

  return response.json();
}