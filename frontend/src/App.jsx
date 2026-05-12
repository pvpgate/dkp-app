import { useEffect, useState } from "react";
import CreateClan from "./components/CreateClan";
import MyClans from "./components/MyClans";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClanPage from "./pages/ClanPage";
import MemberPage from "./pages/MemberPage";
import Layout from "./components/Layout";
import JoinClan from "./components/JoinClan";
import MyRequests from "./components/MyRequests";

function HomePage({
  user,
  initData,
  clansRefreshKey,
  setClansRefreshKey,
  requestsRefreshKey,
  setRequestsRefreshKey
}) {
  return (
    <Layout>
      <h2>Добро пожаловать, {user.first_name}</h2>

      <MyClans
        initData={initData}
        refreshKey={clansRefreshKey}
      />

      <MyRequests
        initData={initData}
        refreshKey={requestsRefreshKey}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          marginTop: 20,
          width: "100%",
        }}
      >
        <JoinClan
          initData={initData}
          onRequestCreated={() =>
            setRequestsRefreshKey((prev) => prev + 1)
          }
        />

        <CreateClan
          initData={initData}
          onClanCreated={() =>
            setClansRefreshKey((prev) => prev + 1)
          }
        />
      </div>
    </Layout>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [initData, setInitData] = useState("");
  const [clansRefreshKey, setClansRefreshKey] = useState(0);
  const [requestsRefreshKey, setRequestsRefreshKey] = useState(0);

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
              requestsRefreshKey={requestsRefreshKey}
              setRequestsRefreshKey={setRequestsRefreshKey}
            />
          }
        />

        <Route
          path="/clan/:clanId"
          element={<ClanPage initData={initData} />}
        />

        <Route
          path="/clan/:clanId/member/:memberId"
          element={<MemberPage initData={initData} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;