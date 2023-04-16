import { useState, useEffect } from "react";

function useColorMode() {
  const [colorMode, setColorMode] = useState("light");

  const toggleColorMode = () => {
    setColorMode((prevColorMode) =>
      prevColorMode === "light" ? "dark" : "light"
    );
  };

  useEffect(() => {
    if (colorMode === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [colorMode]);

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setColorMode("dark");
    } else {
      setColorMode("white");
    }
  }, []);

  return [colorMode, toggleColorMode];
}

export default useColorMode;
