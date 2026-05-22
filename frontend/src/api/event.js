const API_URL = "https://generous-joy-production-87dc.up.railway.app";

export async function getEvent(clanId, eventId, initData) {
  const response = await fetch(`${API_URL}/clans/${clanId}/events/${eventId}`, {
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

export async function deleteEvent(clanId, eventId, initData) {
  const response = await fetch(`${API_URL}/clans/${clanId}/events/${eventId}/delete`, {
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

export async function joinEvent(clanId, eventId, initData) {
  const response = await fetch(`${API_URL}/clans/${clanId}/events/${eventId}/join`, {
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

export async function leaveEvent(clanId, eventId, initData) {
  const response = await fetch(`${API_URL}/clans/${clanId}/events/${eventId}/leave`, {
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

export async function getEventParticipants(clanId, eventId, initData) {
  const response = await fetch(`${API_URL}/clans/${clanId}/events/${eventId}/participants`, {
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