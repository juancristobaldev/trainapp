import { useEffect, useState } from "react";

const useDarkMode = () => {
  const [darkMode, updateDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return {
    darkMode,
    updateDarkMode,
  };
};

export { useDarkMode };
