const API_URL = "https://generous-joy-production-87dc.up.railway.app";

export async function leaveClan(clanId, initData, clanName) {
  const response = await fetch(`${API_URL}/clans/${clanId}/leave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      initData,
      clanName,
    }),
  });

  return response.json();
}