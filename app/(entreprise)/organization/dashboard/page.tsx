import * as React from "react";
import type { Metadata } from "next";

import { config } from "@/config";
import DeviceOrganization from "@/components/dashboard/Overview/DeviceOrganization";

export const metadata = {
  title: `Organization | Dashboard | ${config.site.name}`,
} satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <DeviceOrganization />;
}
