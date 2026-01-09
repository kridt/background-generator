"use client";

import { useState, useEffect } from "react";

interface Birthday {
  name: string;
  month: number;
  day: number;
  type: "self" | "family" | "friend";
  year?: number;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function AdminPage() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [type, setType] = useState<"self" | "family" | "friend">("friend");
  const [year, setYear] = useState("");

  useEffect(() => {
    fetchBirthdays();
  }, []);

  async function fetchBirthdays() {
    try {
      const res = await fetch("/api/birthdays");
      const data = await res.json();
      setBirthdays(data.birthdays || []);
    } catch (err) {
      setError("Failed to load birthdays");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const birthday: Birthday = {
      name,
      month,
      day,
      type,
    };

    if (year) {
      birthday.year = parseInt(year);
    }

    try {
      const res = await fetch("/api/birthdays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(birthday),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add birthday");
        return;
      }

      setBirthdays(data.birthdays);
      setSuccess(`Added ${name}'s birthday`);
      setName("");
      setYear("");
    } catch (err) {
      setError("Failed to add birthday");
    }
  }

  async function handleDelete(birthdayName: string) {
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/birthdays", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: birthdayName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to delete birthday");
        return;
      }

      setBirthdays(data.birthdays);
      setSuccess(`Removed ${birthdayName}'s birthday`);
    } catch (err) {
      setError("Failed to delete birthday");
    }
  }

  const typeColors = {
    self: "#F5C842",
    family: "#5B9CF6",
    friend: "#5B9CF6",
  };

  const typeLabels = {
    self: "Self",
    family: "Family",
    friend: "Friend",
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Birthday Manager</h1>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {/* Add Birthday Form */}
        <form onSubmit={handleAdd} style={styles.form}>
          <h2 style={styles.subtitle}>Add Birthday</h2>

          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
                placeholder="e.g. Mom"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Birthday["type"])}
                style={styles.input}
              >
                <option value="self">Self</option>
                <option value="family">Family</option>
                <option value="friend">Friend</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                style={styles.input}
              >
                {MONTHS.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Day</label>
              <input
                type="number"
                min={1}
                max={31}
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value))}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Birth Year (optional)</label>
              <input
                type="number"
                min={1900}
                max={2030}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                style={styles.input}
                placeholder="e.g. 1990"
              />
            </div>
          </div>

          <button type="submit" style={styles.button}>
            Add Birthday
          </button>
        </form>

        {/* Birthday List */}
        <div style={styles.list}>
          <h2 style={styles.subtitle}>Birthdays ({birthdays.length})</h2>

          {birthdays.length === 0 ? (
            <p style={styles.empty}>No birthdays added yet</p>
          ) : (
            <div style={styles.birthdayGrid}>
              {birthdays.map((b, i) => (
                <div key={i} style={styles.birthdayCard}>
                  <div style={styles.birthdayInfo}>
                    <span
                      style={{
                        ...styles.typeBadge,
                        backgroundColor: typeColors[b.type],
                      }}
                    >
                      {typeLabels[b.type]}
                    </span>
                    <span style={styles.birthdayName}>{b.name}</span>
                    <span style={styles.birthdayDate}>
                      {MONTHS[b.month - 1]} {b.day}
                      {b.year && `, ${b.year}`}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(b.name)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Link */}
        <div style={styles.preview}>
          <a href="/days?width=400&height=800" target="_blank" style={styles.link}>
            Preview Wallpaper
          </a>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0A0E13",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  card: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#12171E",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  },
  title: {
    color: "#E8EAED",
    fontSize: "28px",
    fontWeight: 600,
    marginBottom: "20px",
    textAlign: "center",
  },
  subtitle: {
    color: "#D4D7DC",
    fontSize: "18px",
    fontWeight: 500,
    marginBottom: "15px",
  },
  form: {
    marginBottom: "30px",
    paddingBottom: "30px",
    borderBottom: "1px solid #2A3140",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    color: "#9CA3AF",
    fontSize: "13px",
    marginBottom: "6px",
  },
  input: {
    backgroundColor: "#1E2530",
    border: "1px solid #2A3140",
    borderRadius: "8px",
    padding: "10px 12px",
    color: "#E8EAED",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    backgroundColor: "#E85D3B",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    width: "100%",
  },
  list: {
    marginBottom: "20px",
  },
  empty: {
    color: "#6B7280",
    textAlign: "center",
    padding: "20px",
  },
  birthdayGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  birthdayCard: {
    backgroundColor: "#1E2530",
    borderRadius: "10px",
    padding: "12px 15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  birthdayInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  typeBadge: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 600,
    color: "#0A0E13",
  },
  birthdayName: {
    color: "#E8EAED",
    fontWeight: 500,
  },
  birthdayDate: {
    color: "#9CA3AF",
    fontSize: "13px",
  },
  deleteButton: {
    backgroundColor: "transparent",
    border: "1px solid #EF4444",
    color: "#EF4444",
    borderRadius: "6px",
    padding: "6px 12px",
    fontSize: "12px",
    cursor: "pointer",
  },
  error: {
    backgroundColor: "#7F1D1D",
    color: "#FCA5A5",
    padding: "10px 15px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontSize: "14px",
  },
  success: {
    backgroundColor: "#14532D",
    color: "#86EFAC",
    padding: "10px 15px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontSize: "14px",
  },
  preview: {
    textAlign: "center",
    paddingTop: "20px",
    borderTop: "1px solid #2A3140",
  },
  link: {
    color: "#5B9CF6",
    textDecoration: "none",
    fontSize: "14px",
  },
};
