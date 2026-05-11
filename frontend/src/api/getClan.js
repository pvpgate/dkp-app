const API_URL = "https://generous-joy-production-87dc.up.railway.app";

export async function getClan(clanId) {
  const response = await fetch(`${API_URL}/clans/${clanId}`);

  return response.json();
}