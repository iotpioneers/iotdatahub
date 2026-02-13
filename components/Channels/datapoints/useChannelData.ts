"use client";

import { useState, useEffect, useCallback } from "react";
import { Channel, ActivityItem, WidgetData, Device } from "./channel-types";

interface UseChannelDataReturn {
  channel: Channel | null;
  activities: ActivityItem[];
  widgetData: Record<string, WidgetData>;
  isLoading: boolean;
  error: string | null;
  fetchChannel: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing channel data
 */
export function useChannelData(channelId?: string): UseChannelDataReturn {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [widgetData, setWidgetData] = useState<Record<string, WidgetData>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches channel data from the API.
   */
  const fetchChannel = useCallback(async (): Promise<void> => {
    if (!channelId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/channels/${channelId}/data`);

      if (!response.ok) {
        throw new Error(`Failed to fetch channel data: ${response.statusText}`);
      }

      const data = await response.json();

      // Set the channel data from API response
      setChannel(data.channel);

      // Set widget data from API response
      if (data.widgetData) {
        setWidgetData(data.widgetData);
      }

      // Set activity data from API response
      if (data.activity && Array.isArray(data.activity)) {
        setActivities(data.activity);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load channel");
      console.error("Error fetching channel data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [channelId]);

  // Initial fetch
  useEffect(() => {
    fetchChannel();
  }, [fetchChannel]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchChannel();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchChannel]);

  return {
    channel,
    activities,
    widgetData,
    isLoading,
    error,
    fetchChannel,
  };
}
