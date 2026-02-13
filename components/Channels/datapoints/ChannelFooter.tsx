"use client";

import { formatTimeAgo } from "./channel-utils";

interface ChannelFooterProps {
  channelId: string;
  updatedAt: string;
}

/**
 * Channel page footer with metadata
 */
export default function ChannelFooter({
  channelId,
  updatedAt,
}: ChannelFooterProps): JSX.Element {
  return (
    <div className="text-center text-xs text-slate-700 pb-4">
      Channel ID:{" "}
      <span className="font-mono text-slate-600">{channelId}</span>
      {" · "}
      Last updated:{" "}
      <span className="font-mono text-slate-600">
        {formatTimeAgo(updatedAt)}
      </span>
    </div>
  );
}
