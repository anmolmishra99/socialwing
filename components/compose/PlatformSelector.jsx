"use client";

import { useAccountsStore } from "@/store/accountsStore";

export default function PlatformSelector({ selectedPlatforms, onToggle }) {
  const { accounts } = useAccountsStore();

  if (accounts.length === 0) {
    return (
      <div style={{ padding: "12px", border: "1.5px dashed #ccc", borderRadius: "8px", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "#888", fontWeight: 500 }}>
          No accounts connected. <a href="/dashboard/accounts" style={{ color: "#5945FE", fontWeight: 700 }}>Connect one →</a>
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      {accounts.map((account) => {
        const isSelected = selectedPlatforms.includes(account.platform);
        return (
          <button
            key={account.platform}
            onClick={() => onToggle(account.platform)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 16px",
              background: isSelected ? "#000" : "#fff",
              color: isSelected ? "#fff" : "#000",
              border: "3.5px solid #000",
              borderRadius: "12px",
              boxShadow: isSelected ? "4px 4px 0 #000" : "2px 2px 0 #000",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: "0.9rem",
              transition: "all 0.1s transform ease",
              transform: isSelected ? "translateY(2px)" : "none",
            }}
          >
            {account.avatarUrl ? (
              <img 
                src={account.avatarUrl} 
                alt={account.handle} 
                style={{ 
                  width: "24px", 
                  height: "24px", 
                  borderRadius: "50%",
                  border: isSelected ? "1.5px solid #fff" : "1.5px solid #000"
                }} 
              />
            ) : (
               <div style={{ 
                 width: "24px", 
                 height: "24px", 
                 borderRadius: "50%", 
                 background: "#5945FE",
                 display: "flex",
                 alignItems: "center",
                 justifyContent: "center",
                 fontSize: "0.6rem",
                 color: "#fff"
               }}>
                 {account.platform[0].toUpperCase()}
               </div>
            )}
            <div style={{ textAlign: "left" }}>
               <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", opacity: isSelected ? 0.8 : 0.6 }}>
                 {account.platform}
               </div>
               <div style={{ fontSize: "0.85rem" }}>
                 {account.handle || account.displayName}
               </div>
            </div>
            {isSelected && (
              <div style={{ marginLeft: "4px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
