import React from "react";

const LoadingSpinner = ({ size = "medium", color = "#3498db" }) => {
  // Define the styles based on size prop
  const getSpinnerSize = () => {
    switch (size) {
      case "small":
        return { width: "16px", height: "16px", borderWidth: "2px" };
      case "large":
        return { width: "48px", height: "48px", borderWidth: "4px" };
      default: // medium
        return { width: "32px", height: "32px", borderWidth: "3px" };
    }
  };

  const spinnerStyle = {
    ...getSpinnerSize(),
    border: `${getSpinnerSize().borderWidth} solid #f3f3f3`,
    borderTop: `${getSpinnerSize().borderWidth} solid ${color}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle} role="status" aria-label="Loading" />
    </div>
  );
};

export default LoadingSpinner;
