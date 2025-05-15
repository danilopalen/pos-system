import { useState, useEffect } from "react";

export const useConnection = () => {
  const [isOnline, setIsOnline] = useState(true); // Default to true
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      // Set initial state based on actual online status
      setIsOnline(window.navigator.onLine);
      setShowStatus(!window.navigator.onLine);

      const handleOnline = () => {
        setIsOnline(true);
        // Show confirmation briefly when connection is restored
        setShowStatus(true);
        setTimeout(() => setShowStatus(false), 3000);
      };

      const handleOffline = () => {
        setIsOnline(false);
        setShowStatus(true);
      };

      // Add event listeners
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Cleanup
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  return {
    isOnline,
    showStatus,
    // Additional helper methods could be added here
    hideStatus: () => setShowStatus(false),
    forceShow: () => setShowStatus(true),
  };
};
