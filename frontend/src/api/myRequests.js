const API_URL = "https://generous-joy-production-87dc.up.railway.app";

export async function getMyRequests(initData) {
  const response = await fetch(`${API_URL}/my-requests`, {
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