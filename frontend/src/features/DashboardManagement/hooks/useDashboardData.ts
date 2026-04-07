import { useState, useCallback, useEffect, useRef } from "react";
import dashboardService from "../../../services/dashboard.services";
import type { IGlobalResponse, ISingleTestResponse } from "@/types/dashboard.types";

type View = "global" | "single";

export function useDashboardData() {
  const [view, setView] = useState<View>("global");
  const [tests, setTests] = useState<{ id: string; title: string; start_at: string }[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [globalData, setGlobalData] = useState<IGlobalResponse | null>(null);
  const [singleData, setSingleData] = useState<ISingleTestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Cache refs (survive re-renders, don't trigger them) ──────────────────
  const globalCache = useRef<IGlobalResponse | null>(null);
  const singleCache = useRef<Map<string, ISingleTestResponse>>(new Map());
  const activeRequest = useRef<AbortController | null>(null);

  const loadGlobal = useCallback(async (force = false) => {
    // Return cached data immediately — no spinner
    if (!force && globalCache.current) {
      setGlobalData(globalCache.current);
      setView("global");
      return;
    }

    // Cancel any in-flight request
    activeRequest.current?.abort();
    activeRequest.current = new AbortController();

    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.fetchAllTestsAnalytics();
      globalCache.current = data!;
      setGlobalData(data!);
      setTests(
        (data!.testWiseAnalytics ?? []).map((t) => ({
          id: t.testId,
          title: t.title,
          start_at: t.start_at,
        }))
      );
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setError(e?.message ?? "Failed to load analytics.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSingle = useCallback(async (id: string, force = false) => {
    // Return cached data immediately — no spinner
    if (!force && singleCache.current.has(id)) {
      setSingleData(singleCache.current.get(id)!);
      setView("single");
      setSelectedId(id);
      return;
    }

    // Cancel any in-flight request
    activeRequest.current?.abort();
    activeRequest.current = new AbortController();

    setLoading(true);
    setError(null);
    setSingleData(null);
    try {
      const data = await dashboardService.fetchSingleTestAnalytics(id);
      singleCache.current.set(id, data!);
      setSingleData(data!);
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setError(e?.message ?? "Failed to load test analytics.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGlobal();
  }, []); // ← remove loadGlobal from deps, run once only

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setView("single");
    loadSingle(id); // uses cache if available — instant switch
  };

  const handleGlobal = () => {
    setView("global");
    setSelectedId("");
    loadGlobal(); // uses cache — instant switch
  };

  const refresh = () => {
    if (view === "global") loadGlobal(true);   // force = true bypasses cache
    else loadSingle(selectedId, true);
  };

  return {
    view, tests, selectedId, globalData, singleData,
    loading, error, handleSelect, handleGlobal, refresh,
  };
}