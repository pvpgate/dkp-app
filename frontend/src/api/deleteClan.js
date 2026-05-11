const API_URL = "https://generous-joy-production-87dc.up.railway.app";

export async function deleteClan(clanId, initData, clanName) {
  const response = await fetch(`${API_URL}/clans/${clanId}`, {
    method: "DELETE",
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