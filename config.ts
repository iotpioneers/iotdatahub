import { getSiteURL } from "@/lib/get-site-url";

export interface Config {
  site: { name: string; description: string; themeColor: string; url: string };
}

export const config: Config = {
  site: {
    name: "IoTDataHub",
    description:
      "Scalable IoT data aggregation platform for enterprise-level device management and real-time monitoring",
    themeColor: "#090a0b",
    url: getSiteURL(),
  },
};
