"use client";

import { useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarView() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isToday = (day) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const navBtnStyle = {
    background: "#fff",
    border: "2px solid #000",
    borderRadius: "7px",
    boxShadow: "3px 3px 0 #000",
    padding: "7px 12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.1s, box-shadow 0.1s",
    lineHeight: 0,
  };

  return (
    <div style={{ maxWidth: "1100px", position: "relative" }}>
      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-10px",
          fontSize: "8rem",
          fontWeight: 900,
          color: "rgba(0,0,0,0.02)",
          letterSpacing: "-0.04em",
          pointerEvents: "none",
          userSelect: "none",
          lineHeight: 1,
        }}
      >
        SCHEDULE
      </div>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h2
            style={{
              fontWeight: 800,
              fontSize: "1.8rem",
              color: "#000",
              letterSpacing: "-0.03em",
              marginBottom: "6px",
            }}
          >
            Calendar
          </h2>
          <p style={{ color: "#666", fontSize: "0.95rem", fontWeight: 500 }}>
            View and manage your scheduled posts.
          </p>
        </div>
        <button
          style={{
            background: "#5945FE",
            color: "#fff",
            border: "2px solid #000",
            borderRadius: "7px",
            boxShadow: "3px 3px 0 #000",
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.9rem",
            transition: "transform 0.1s, box-shadow 0.1s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(2px, 2px)";
            e.currentTarget.style.boxShadow = "1px 1px 0 #000";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "3px 3px 0 #000";
          }}
        >
          + New Post
        </button>
      </div>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {/* ── Calendar Grid ── */}
        <div
          style={{
            flex: "1 1 600px",
            background: "#fff",
            border: "2px solid #000",
            borderRadius: "10px",
            boxShadow: "4px 4px 0 #000",
            overflow: "hidden",
          }}
        >
          {/* Month nav */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              borderBottom: "2px solid #000",
              background: "#fafafa",
            }}
          >
            <button
              onClick={prevMonth}
              style={navBtnStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(2px, 2px)";
                e.currentTarget.style.boxShadow = "1px 1px 0 #000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "3px 3px 0 #000";
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#000"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <h3
              style={{
                fontWeight: 800,
                fontSize: "1.2rem",
                color: "#000",
                letterSpacing: "-0.02em",
              }}
            >
              {MONTHS[currentMonth]} {currentYear}
            </h3>

            <button
              onClick={nextMonth}
              style={navBtnStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(2px, 2px)";
                e.currentTarget.style.boxShadow = "1px 1px 0 #000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "3px 3px 0 #000";
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#000"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Day labels */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              borderBottom: "1px solid #eee",
            }}
          >
            {DAYS.map((d) => (
              <div
                key={d}
                style={{
                  padding: "10px",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}
          >
            {cells.map((day, i) => (
              <div
                key={i}
                onClick={() => day && setSelectedDate(day)}
                style={{
                  minHeight: "80px",
                  padding: "8px",
                  borderRight: (i + 1) % 7 !== 0 ? "1px solid #f0f0f0" : "none",
                  borderBottom: "1px solid #f0f0f0",
                  cursor: day ? "pointer" : "default",
                  background:
                    selectedDate === day && day
                      ? "#f0eeff"
                      : isToday(day)
                        ? "#fffbe6"
                        : "transparent",
                  transition: "background 0.1s",
                }}
              >
                {day && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      fontWeight: isToday(day) ? 800 : 600,
                      fontSize: "0.85rem",
                      color: isToday(day) ? "#fff" : "#333",
                      background: isToday(day) ? "#5945FE" : "transparent",
                    }}
                  >
                    {day}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Side panel ── */}
        <div style={{ flex: "0 0 280px" }}>
          <div
            style={{
              background: "#fff",
              border: "2px solid #000",
              borderRadius: "10px",
              boxShadow: "3px 3px 0 #000",
              padding: "20px",
              position: "sticky",
              top: "20px",
            }}
          >
            <p
              style={{
                fontWeight: 700,
                fontSize: "0.78rem",
                color: "#888",
                marginBottom: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              {selectedDate
                ? `${MONTHS[currentMonth]} ${selectedDate}, ${currentYear}`
                : "Select a date"}
            </p>
            <div
              style={{
                background: "#f9f9f9",
                border: "1.5px solid #eee",
                borderRadius: "8px",
                padding: "28px 16px",
                textAlign: "center",
              }}
            >
              <svg
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#ccc"
                strokeWidth="1.5"
                style={{ margin: "0 auto 10px", display: "block" }}
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p
                style={{ fontSize: "0.85rem", color: "#999", fontWeight: 500 }}
              >
                {selectedDate
                  ? "No posts scheduled for this day"
                  : "Click a date to see scheduled posts"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
