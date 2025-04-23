import { useState, useEffect } from "react";
import { PinConfig } from "@/types/pin-config";

export const usePinConfig = (deviceId: string, widgetId: string) => {
  const [pinConfig, setPinConfig] = useState<PinConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!deviceId || !widgetId) return;

    const fetchPinConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/devices/${deviceId}/widgets/${widgetId}/pin`,
        );
        if (!response.ok) throw new Error("Failed to fetch pin config");
        const data = await response.json();
        setPinConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setPinConfig(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPinConfig();
  }, [deviceId, widgetId]);

  return { pinConfig, loading, error };
};
