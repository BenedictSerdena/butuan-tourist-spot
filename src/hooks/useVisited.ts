import { useState, useCallback } from "react";

export function useVisited() {
  const [visited, setVisited] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem("btsp_visited");
      return new Set(raw ? (JSON.parse(raw) as number[]) : []);
    } catch {
      return new Set();
    }
  });

  const toggle = useCallback((id: number) => {
    setVisited((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("btsp_visited", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setVisited(new Set());
    localStorage.removeItem("btsp_visited");
  }, []);

  return { visited, toggle, reset };
}
