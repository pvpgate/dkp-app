function Layout({ children }) {
  return (
    <div
      style={{
        padding: 20,
        paddingTop: 100,
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}

export default Layout;