const API_URL = "https://generous-joy-production-87dc.up.railway.app";

export async function resetClanDkp(clanId, initData, confirmText) {
  const response = await fetch(`${API_URL}/clans/${clanId}/reset-dkp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      initData,
      confirmText,
    }),
  });

  return response.json();
}