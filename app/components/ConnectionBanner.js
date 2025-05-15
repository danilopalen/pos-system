"use client";

import React, { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { useConnection } from "../useConnection";

const ConnectionBanner = () => {
  const { isOnline, showStatus } = useConnection();

  if (!showStatus) return null;

  const styles = {
    banner: {
      position: "sticky",
      top: 0,
      left: 0,
      right: 0,
      padding: "12px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "14px",
      fontWeight: 500,
      zIndex: 1000,
      animation: "slideDown 0.3s ease-out",
      transition: "background-color 0.3s ease",
    },
    online: {
      backgroundColor: "#4CAF50",
      color: "white",
    },
    offline: {
      backgroundColor: "#f44336",
      color: "white",
    },
    "@keyframes slideDown": {
      from: {
        transform: "translateY(-100%)",
      },
      to: {
        transform: "translateY(0)",
      },
    },
  };

  const bannerStyle = {
    ...styles.banner,
    ...(isOnline ? styles.online : styles.offline),
  };

  return (
    <div style={bannerStyle}>
      {isOnline ? (
        <>
          <Wifi size={18} />
          Connected to the internet
        </>
      ) : (
        <>
          <WifiOff size={18} />
          No internet connection
        </>
      )}
    </div>
  );
};

export default ConnectionBanner;
