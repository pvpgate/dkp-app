const API_URL = "https://generous-joy-production-87dc.up.railway.app";

export async function getClanEvents(clanId, initData) {
  const response = await fetch(`${API_URL}/clans/${clanId}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      initData,
    }),
  });

  return response.json();
}

export async function createEvent(clanId, initData, title, dkpReward) {
  const response = await fetch(`${API_URL}/clans/${clanId}/events/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      initData,
      title,
      dkpReward,
    }),
  });

  return response.json();
}