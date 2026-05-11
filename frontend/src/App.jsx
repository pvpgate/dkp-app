import { useEffect, useState } from "react";
import CreateClan from "./components/CreateClan";
import MyClans from "./components/MyClans";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClanPage from "./pages/ClanPage";
import Layout from "./components/Layout";

function HomePage({
  user,
  initData,
  clansRefreshKey,
  setClansRefreshKey
}) {
  return (
    <Layout>
      <h2>Добро пожаловать, {user.first_name}</h2>

      <MyClans
        initData={initData}
        refreshKey={clansRefreshKey}
      />

      <CreateClan
        initData={initData}
        onClanCreated={() =>
          setClansRefreshKey((prev) => prev + 1)
        }
      />
    </Layout>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [initData, setInitData] = useState("");
  const [clansRefreshKey, setClansRefreshKey] = useState(0);

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
      <Layout>
        <p>No Telegram user (open inside Telegram)</p>
      </Layout>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              user={user}
              initData={initData}
              clansRefreshKey={clansRefreshKey}
              setClansRefreshKey={setClansRefreshKey}
            />
          }
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