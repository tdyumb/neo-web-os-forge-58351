import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("neo-theme");
    return (saved as Theme) || "dark";
  });

  const [accentColor, setAccentColorState] = useState<string>(() => {
    return localStorage.getItem("neo-accent-color") || "purple";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Handle theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.toggle("dark", systemTheme === "dark");
    } else {
      root.classList.toggle("dark", theme === "dark");
    }

    // Handle accent colors
    const accentColors: { [key: string]: { primary: string; accent: string } } = {
      purple: { primary: "250 100% 65%", accent: "280 100% 70%" },
      blue: { primary: "217 91% 60%", accent: "200 100% 70%" },
      green: { primary: "142 76% 36%", accent: "160 84% 39%" },
      orange: { primary: "25 95% 53%", accent: "35 100% 60%" },
      pink: { primary: "330 81% 60%", accent: "340 82% 52%" },
    };

    const colors = accentColors[accentColor] || accentColors.purple;
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--accent", colors.accent);

    localStorage.setItem("neo-theme", theme);
    localStorage.setItem("neo-accent-color", accentColor);
  }, [theme, accentColor]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
