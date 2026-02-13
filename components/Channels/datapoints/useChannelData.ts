"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Channel,
  ActivityItem,
  WidgetData,
  PaginationInfo,
} from "./channel-types";

interface UseChannelDataReturn {
  channel: Channel | null;
  activities: ActivityItem[];
  widgetData: Record<string, WidgetData>;
  pagination: PaginationInfo | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  currentPage: number;
  fetchChannel: (page?: number) => Promise<void>;
  loadNextPage: () => Promise<void>;
  loadPrevPage: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing channel data with pagination
 */
export function useChannelData(
  channelId?: string,
  pageSize: number = 10,
): UseChannelDataReturn {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [widgetData, setWidgetData] = useState<Record<string, WidgetData>>({});
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Track if we've done the initial fetch for this channelId
  const hasFetchedRef = useRef<string | null>(null);

  /**
   * Fetches channel data from the API.
   */
  const fetchChannel = useCallback(
    async (page: number = 1): Promise<void> => {
      if (!channelId) return;

      try {
        // Only show main loading on initial load or page 1
        if (page === 1 && hasFetchedRef.current !== channelId) {
          setIsLoading(true);
        } else if (page !== currentPage) {
          setIsLoadingMore(true);
        }

        setError(null);

        const response = await fetch(
          `/api/channels/${channelId}/data?page=${page}&limit=${pageSize}`,
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch channel data: ${response.statusText}`,
          );
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

        // Set pagination info
        if (data.pagination) {
          setPagination(data.pagination);
          setCurrentPage(data.pagination.currentPage);
        }

        // Mark that we've fetched for this channel
        hasFetchedRef.current = channelId;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load channel");
        console.error("Error fetching channel data in client:", err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [channelId, pageSize, currentPage],
  );

  /**
   * Load next page of devices
   */
  const loadNextPage = useCallback(async (): Promise<void> => {
    if (pagination?.hasNextPage) {
      await fetchChannel(currentPage + 1);
    }
  }, [pagination, currentPage, fetchChannel]);

  /**
   * Load previous page of devices
   */
  const loadPrevPage = useCallback(async (): Promise<void> => {
    if (pagination?.hasPrevPage) {
      await fetchChannel(currentPage - 1);
    }
  }, [pagination, currentPage, fetchChannel]);

  // Initial load when channelId changes
  useEffect(() => {
    if (!channelId) {
      setChannel(null);
      setActivities([]);
      setWidgetData({});
      setPagination(null);
      hasFetchedRef.current = null;
      return;
    }

    // Only fetch if we haven't already fetched for this channelId
    if (hasFetchedRef.current !== channelId) {
      fetchChannel(1);
    }
  }, [channelId, fetchChannel]);

  // Auto-refresh every 10 seconds (separate effect)
  useEffect(() => {
    if (!channelId || !hasFetchedRef.current) return;

    // Set up interval for auto-refresh every 10 seconds
    const interval = setInterval(() => {
      // Silently refresh the current page without showing loading state
      fetchChannel(currentPage);
    }, 10000); // 10 seconds

    // Cleanup interval on unmount or when dependencies change
    return () => clearInterval(interval);
  }, [channelId, currentPage, fetchChannel]);

  return {
    channel,
    activities,
    widgetData,
    pagination,
    isLoading,
    isLoadingMore,
    error,
    currentPage,
    fetchChannel,
    loadNextPage,
    loadPrevPage,
  };
}
