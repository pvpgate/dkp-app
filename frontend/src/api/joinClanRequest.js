const API_URL = "https://generous-joy-production-87dc.up.railway.app";

export async function sendJoinClanRequest(initData, publicId, gameNickname) {
  const response = await fetch(`${API_URL}/clans/join-request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      initData,
      publicId,
      gameNickname,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.log("JOIN REQUEST ERROR:", result);

    return {
      ok: false,
      error: JSON.stringify(result),
    };
  }

  return result;
}