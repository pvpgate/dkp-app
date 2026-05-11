import { useEffect, useState } from "react";
import CreateClan from "./components/CreateClan";
import MyClans from "./components/MyClans";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClanPage from "./pages/ClanPage";

function HomePage({ user, initData }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>Добро пожаловать, {user.first_name}</h2>

      <MyClans initData={initData} />

      <CreateClan initData={initData} />
    </div>
  );
}

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

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <p>No Telegram user (open inside Telegram)</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage user={user} initData={initData} />}
        />

        <Route
          path="/clan/:clanId"
          element={<ClanPage initData={initData} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;