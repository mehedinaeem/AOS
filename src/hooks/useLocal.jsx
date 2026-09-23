import { createContext, useContext, useEffect, useState } from "react";
const KEY = "aos:v1:learning";
const empty = {
  completed: [],
  bookmarks: [],
  recent: [],
  notes: {},
  theme: "system",
};
export function parseLocal(raw) {
  try {
    const v = JSON.parse(raw);
    return {
      completed: Array.isArray(v?.completed)
        ? v.completed.filter((x) => typeof x === "string")
        : [],
      bookmarks: Array.isArray(v?.bookmarks)
        ? v.bookmarks.filter((x) => typeof x === "string")
        : [],
      recent: Array.isArray(v?.recent)
        ? v.recent.filter((x) => typeof x === "string")
        : [],
      notes:
        v?.notes && typeof v.notes === "object" && !Array.isArray(v.notes)
          ? v.notes
          : {},
      theme: ["light", "dark", "system"].includes(v?.theme)
        ? v.theme
        : "system",
    };
  } catch {
    return { ...empty };
  }
}
const Context = createContext(null);
export function LocalProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      return parseLocal(localStorage.getItem(KEY));
    } catch {
      return { ...empty };
    }
  });
  const [available, setAvailable] = useState(true);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      setAvailable(false);
    }
  }, [data]);
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const apply = () =>
      document.documentElement.classList.toggle(
        "dark",
        data.theme === "dark" || (data.theme === "system" && media.matches),
      );
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [data.theme]);
  const toggle = (field, id) =>
    setData((d) => ({
      ...d,
      [field]: d[field].includes(id)
        ? d[field].filter((x) => x !== id)
        : [...d[field], id],
    }));
  return (
    <Context.Provider
      value={{
        data,
        setData,
        toggle,
        available,
        clear: () => setData({ ...empty }),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useLocal = () => useContext(Context);
