"use client";

import { useState } from "react";

export default function SchedulePicker({ scheduleType, onTypeChange, date, time, onDateChange, onTimeChange }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "3.5px solid #000",
        borderRadius: "12px",
        boxShadow: "6px 6px 0 #000",
        padding: "24px",
        marginBottom: "24px",
      }}
    >
      <p
        style={{
          fontWeight: 900,
          fontSize: "0.9rem",
          color: "#000",
          marginBottom: "18px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Post Schedule
      </p>
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        {[
          { value: "now", label: "Post Now" },
          { value: "schedule", label: "Schedule" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => onTypeChange(opt.value)}
            style={{
              padding: "10px 24px",
              background: scheduleType === opt.value ? "#000" : "#fff",
              color: scheduleType === opt.value ? "#fff" : "#000",
              border: "3.5px solid #000",
              borderRadius: "8px",
              boxShadow:
                scheduleType === opt.value ? "4px 4px 0 #000" : "2px 2px 0 #000",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: "0.9rem",
              transition: "all 0.1s",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {scheduleType === "schedule" && (
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "3px solid #000",
              borderRadius: "8px",
              fontSize: "1rem",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              outline: "none",
              color: "#000"
            }}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "3px solid #000",
              borderRadius: "8px",
              fontSize: "1rem",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              outline: "none",
              color: "#000"
            }}
          />
        </div>
      )}
    </div>
  );
}
