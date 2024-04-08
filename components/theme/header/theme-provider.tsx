"use client";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const appStateRaw = localStorage.getItem("ragArenaAppState");
    const appState = appStateRaw ? JSON.parse(appStateRaw) : {};
    const savedTheme = appState.theme ?? "light";
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      const appStateRaw = localStorage.getItem("ragArenaAppState");
      const appState = appStateRaw ? JSON.parse(appStateRaw) : {};
      appState.theme = newTheme;
      localStorage.setItem("ragArenaAppState", JSON.stringify(appState));
      document.documentElement.className = newTheme;
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
