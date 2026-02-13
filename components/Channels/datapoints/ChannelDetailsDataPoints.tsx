"use client";

import { ChannelHeadingProps } from "@/types";
import ChannelDetailsHeading from "../ChannelDetailsHeading";
import InviteCollaboratorModal from "../collaboration/InviteCollaboratorModal";
import ActiveCollaborators from "../collaboration/ActiveCollaborators";
import { useChannelData } from "./useChannelData";
import { Device } from "./channel-types";
import ChannelHeader from "./ChannelHeader";
import ChannelStatsHeader from "./ChannelStatsHeader";
import DevicesList from "./DevicesList";
import ActivityFeed from "./ActivityFeed";
import PageSkeleton from "./PageSkeleton";
import ErrorState from "./ErrorState";
import NotFoundState from "./NotFoundState";

/**
 * ChannelDetailsDataPoints - Main Component
 *
 * Displays full details for a single IoT channel, including:
 * - Channel header with breadcrumb and metadata
 * - Summary stats (device count, field count, health %, access)
 * - All connected devices with collapsible widget grids
 * - Live activity feed (active transmissions + recent uploads)
 */
export default function ChannelDetailsDataPoints({
  roomId,
  roomMetadata,
  currentUserType,
  channel: initialChannel,
  dataPoint,
}: ChannelHeadingProps): JSX.Element {
  const {
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
  } = useChannelData(initialChannel?.id, 10); // 10 devices per page

  // ── RENDER STATES ──────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#080e17] p-6">
        <PageSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchChannel} />;
  }

  if (!channel) {
    return <NotFoundState />;
  }

  // Find first online device for initial expansion
  const firstOnlineDevice = channel.devices.find(
    (d: Device) => d.status === "ONLINE",
  );
  const initialExpandedDevices = firstOnlineDevice
    ? new Set([firstOnlineDevice.id])
    : new Set<string>();

  // ── MAIN RENDER ────────────────────────────────────────────

  return (
    <div
      className="min-h-screen bg-white dark:bg-[#080e17] text-black dark:text-white"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(56,189,248,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ── PAGE HEADER ──────────────────────────────────── */}
        <ChannelHeader
          channel={channel}
          channelName={initialChannel.name}
          dataPointCount={dataPoint.length}
          onRefresh={fetchChannel}
          headingComponent={
            <ChannelDetailsHeading
              roomId={roomId}
              roomMetadata={roomMetadata}
              currentUserType={currentUserType}
              channel={initialChannel}
              dataPoint={dataPoint}
            />
          }
          collaborationSection={
            <>
              {roomMetadata && (
                <InviteCollaboratorModal
                  roomId={roomId}
                  creator={roomMetadata.creatorId}
                  currentUserType={currentUserType}
                />
              )}
              <ActiveCollaborators />
            </>
          }
        />

        {/* ── STATS ROW ──────────────────────────────────────── */}
        <ChannelStatsHeader channel={channel} />

        {/* ── MAIN CONTENT ───────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Devices + Widgets */}
          <div className="xl:col-span-2">
            <DevicesList
              devices={channel.devices}
              widgetData={widgetData}
              pagination={pagination}
              isLoadingMore={isLoadingMore}
              onNextPage={loadNextPage}
              onPrevPage={loadPrevPage}
              onPageChange={(page) => fetchChannel(page)}
              initialExpandedDevices={initialExpandedDevices}
            />
          </div>

          {/* Right: Activity Feed */}
          <div className="xl:col-span-1 min-h-[500px]">
            <ActivityFeed activities={activities} />
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────────── */}
      </div>
    </div>
  );
}
