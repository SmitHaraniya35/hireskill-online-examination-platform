import { useState, useCallback, useEffect } from "react";
import dashboardService from "../../../services/dashboard.services";
import type { IGlobalResponse, ISingleTestResponse } from "@/types/dashboard.types";

type View = "global" | "single";

export interface DashboardState {
  view: View;
  tests: { id: string; title: string; start_at: string }[];
  selectedId: string;
  globalData: IGlobalResponse | null;
  singleData: ISingleTestResponse | null;
  loading: boolean;
  error: string | null;
  handleSelect: (id: string) => void;
  handleGlobal: () => void;
  refresh: () => void;
}

export function useDashboardData(): DashboardState {
  const [view, setView] = useState<View>("global");
  const [tests, setTests] = useState<{ id: string; title: string; start_at: string }[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [globalData, setGlobalData] = useState<IGlobalResponse | null>(null);
  const [singleData, setSingleData] = useState<ISingleTestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGlobal = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.fetchAllTestsAnalytics();
      setGlobalData(data!);
      setTests(
        (data!.testWiseAnalytics ?? []).map((t) => ({
          id: t.testId,
          title: t.title,
          start_at: t.start_at,
        }))
      );
    } catch (e: any) {
      setError(e?.message ?? "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSingle = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.fetchSingleTestAnalytics(id);
      setSingleData(data!);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load test analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGlobal();
  }, [loadGlobal]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setView("single");
    loadSingle(id);
  };

  const handleGlobal = () => {
    setView("global");
    setSelectedId("");
  };

  const refresh = () => {
    if (view === "global") loadGlobal();
    else loadSingle(selectedId);
  };

  return {
    view,
    tests,
    selectedId,
    globalData,
    singleData,
    loading,
    error,
    handleSelect,
    handleGlobal,
    refresh,
  };
}