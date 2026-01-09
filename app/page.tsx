export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#E8EAED",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 300, marginBottom: "1rem" }}>
        Life Calendar Wallpaper
      </h1>
      <p style={{ color: "rgba(232,234,237,0.6)", marginBottom: "2rem", maxWidth: "400px" }}>
        Generate a year-progress dot grid wallpaper for your phone.
        Each dot represents a day of the year.
      </p>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 400, marginBottom: "0.5rem" }}>
          Example URLs
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <a
            href="/days?width=1284&height=2778"
            style={{ color: "#FF6B35", textDecoration: "none" }}
          >
            /days?width=1284&height=2778
          </a>
          <a
            href="/days?width=1170&height=2532"
            style={{ color: "#FF6B35", textDecoration: "none" }}
          >
            /days?width=1170&height=2532
          </a>
          <a
            href="/days?width=1290&height=2796&date=2026-02-22"
            style={{ color: "#FF6B35", textDecoration: "none" }}
          >
            /days?width=1290&height=2796&date=2026-02-22
          </a>
        </div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "1.5rem",
          borderRadius: "8px",
          maxWidth: "500px",
        }}
      >
        <h3 style={{ fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.75rem" }}>
          Query Parameters
        </h3>
        <ul
          style={{
            textAlign: "left",
            color: "rgba(232,234,237,0.7)",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            margin: 0,
            paddingLeft: "1.25rem",
          }}
        >
          <li><strong>width</strong> - Image width (600-3000, default: 1284)</li>
          <li><strong>height</strong> - Image height (900-4000, default: 2778)</li>
          <li><strong>date</strong> - Override date for testing (YYYY-MM-DD)</li>
        </ul>
      </div>

      <div style={{ marginTop: "3rem", color: "rgba(232,234,237,0.4)", fontSize: "0.75rem" }}>
        <span style={{ color: "#E8EAED" }}>●</span> past
        <span style={{ marginLeft: "1rem", color: "rgba(232,234,237,0.3)" }}>●</span> future
        <span style={{ marginLeft: "1rem", color: "#FF6B35" }}>●</span> today
        <span style={{ marginLeft: "1rem", color: "#FFD700" }}>●</span> your birthday
        <span style={{ marginLeft: "1rem", color: "#A855F7" }}>●</span> family
        <span style={{ marginLeft: "1rem", color: "#3B82F6" }}>●</span> friends
      </div>
    </main>
  );
}
