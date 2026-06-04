"use client";

// global-error.tsx catches errors in the ROOT layout (e.g. ClerkProvider crash).
// It MUST include its own <html> and <body> tags since the layout is unavailable.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#030303", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "2rem",
            textAlign: "center",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "1rem",
              border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
            }}
          >
            ⚡
          </div>

          <div>
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                margin: "0 0 0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              Critical Error
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: 400, margin: "0 auto" }}>
              Something went deeply wrong. Try refreshing — if the issue persists, contact support.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={reset}
              style={{
                background: "#D4AF37",
                color: "#000",
                border: "none",
                borderRadius: "0.75rem",
                padding: "0.75rem 2rem",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
            <a
              href="/"
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.75rem",
                padding: "0.75rem 2rem",
                fontSize: "0.8rem",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
