import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (!tg) {
      console.log("Not inside Telegram");
      return;
    }

    tg.ready();

    const u = tg.initDataUnsafe?.user;
    setUser(u);

    if (u) {
      fetch("https://generous-joy-production-87dc.up.railway.app/auth/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          initData: tg.initData
        })
      });
    }
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Mini App</h1>

      {user ? (
        <div>
          <p>ID: {user.id}</p>
          <p>Name: {user.first_name}</p>
          <p>Username: @{user.username}</p>
        </div>
      ) : (
        <p>No Telegram user (open inside Telegram)</p>
      )}
    </div>
  );
}

export default App;