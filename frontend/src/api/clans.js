const API_URL = "https://generous-joy-production-87dc.up.railway.app";

export async function createClan(initData, name) {
  const response = await fetch(`${API_URL}/clans/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      initData,
      name,
    }),
  });

  return response.json();
}