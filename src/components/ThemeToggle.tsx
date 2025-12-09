import { useEffect, useState } from "react";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value);
  };

  return (
    <div className="flex items-center gap-3 transition-all duration-300">

      <label
        htmlFor="theme-select"
        className="font-medium transition-colors duration-300
          text-gray-700 dark:text-gray-200"
      >
        Select Theme:
      </label>

      <select
        id="theme-select"
        value={theme}
        onChange={handleChange}
        className="
          px-3 py-2 rounded-xl cursor-pointer outline-none
          transition-all duration-300

          bg-white text-gray-800 border border-gray-300
          dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600

          shadow-sm hover:shadow-md
          dark:hover:shadow-[0_0_10px_rgba(255,255,255,0.15)]
        "
      >
        <option value="light">Light Mode 🌞</option>
        <option value="dark">Dark Mode 🌙</option>
      </select>
    </div>
  );
};

export default ThemeToggle;
