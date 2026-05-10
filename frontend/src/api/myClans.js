const API_URL = "https://generous-joy-production-87dc.up.railway.app";

export async function getMyClans(initData) {
  const response = await fetch(`${API_URL}/clans/my`, {
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