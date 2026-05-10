import { useEffect, useState } from "react";
import CreateClan from "./components/CreateClan";
import MyClans from "./components/MyClans";

function App() {
  const [user, setUser] = useState(null);
  const [initData, setInitData] = useState("");

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (!tg) {
      console.log("Not inside Telegram");
      return;
    }

    tg.ready();

    setInitData(tg.initData);

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
          <h2>Добро пожаловать, {user.first_name}</h2>

          <MyClans initData={initData} />

          <CreateClan initData={initData} />
        </div>
      ) : (
        <p>No Telegram user (open inside Telegram)</p>
      )}
    </div>
  );
}

export default App;