import React, { useState, useEffect } from "react";

const Banner = ({
  type = "success",
  message = "Operation successful!",
  handleFinish,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      handleFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [handleFinish]);

  if (!isVisible) return null;

  const styles = {
    banner: {
      position: "fixed",
      bottom: "20px",
      left: "20px",
      padding: "16px 24px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      animation: "slideDown 0.3s ease-out",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      gap: "8px",
      maxWidth: "90%",
      width: "auto",
    },
    success: {
      backgroundColor: "#4CAF50",
      color: "white",
      border: "1px solid #45a049",
    },
    error: {
      backgroundColor: "#f44336",
      color: "white",
      border: "1px solid #da190b",
    },
    icon: {
      fontSize: "20px",
      fontWeight: "bold",
    },
    "@keyframes slideDown": {
      from: {
        transform: "translateX(-100%)",
        opacity: 0,
      },
      to: {
        transform: "translateX(0)",
        opacity: 1,
      },
    },
  };

  const bannerStyle = {
    ...styles.banner,
    ...(type === "success" ? styles.success : styles.error),
  };

  return (
    <div style={bannerStyle}>
      <span style={styles.icon}>{type === "success" ? "✓" : "✕"}</span>
      {message}
    </div>
  );
};

export default Banner;
