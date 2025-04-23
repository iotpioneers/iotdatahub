import React, { useState } from "react";
import { Card, CardContent, Button } from "@mui/material";
import {
  TabletSmartphone,
  Edit,
  Eye,
  Trash2,
  Signal,
  Battery,
  AlertTriangle,
  Clock,
  Building2,
  User,
  Radio,
  Key,
  Layout,
} from "lucide-react";
import Link from "next/link";
import { LinearLoading } from "@/components/LinearLoading";
import { DeviceData } from "@/types/device";

interface DeviceCardProps {
  device: DeviceData;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const DeviceCard = ({ device, onEdit, onDelete, onView }: DeviceCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(new Date(date));

  const truncateText = (text: string | null | undefined, wordLimit: number) => {
    if (!text) return "?";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return (
    <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl rounded-5xl">
      {isLoading && <LinearLoading />}
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 -translate-y-16 translate-x-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 translate-y-16 -translate-x-16 bg-gradient-to-tr from-orange-500/10 to-pink-500/10 rounded-full blur-2xl" />

      {/* Status Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div
          className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
            device.status === "ONLINE" ? "bg-green-500" : "bg-red-500"
          } shadow-lg`}
        />
      </div>

      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 shadow-sm">
            <TabletSmartphone className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <Link
              href={`/dashboard/devices/${device.id}`}
              className="text-xl font-semibold hover:text-blue-600 transition-colors"
              onClick={() => setIsLoading(true)}
            >
              {device.name}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Info Cards */}
          <div className="space-y-3">
            {/* Organization Info */}
            <Card className="bg-orange-100 shadow-lg shadow-black rounded-3xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-gray-900" />
                  <span className="font-bold">Organization</span>
                </div>
                <p className="text-sm text-gray-600">
                  {truncateText(device.organization?.name, 3)}
                </p>
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Card className="bg-white shadow-lg shadow-black rounded-3xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-900" />
                  <span className="font-bold">Owner</span>
                </div>
                <p className="text-sm text-gray-600">
                  {truncateText(device.user?.email, 1)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            {/* Channel Info */}
            <Card className="bg-white shadow-lg shadow-black rounded-3xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Radio className="w-4 h-4 text-gray-900" />
                  <span className="font-bold">Channel</span>
                </div>
                <p className="text-sm text-gray-600">
                  {truncateText(device.channel?.name, 3)}
                </p>
              </CardContent>
            </Card>

            {/* API Key */}
            <Card className="bg-orange-100 shadow-lg shadow-black rounded-3xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-gray-900" />
                  <span className="font-bold">API Key</span>
                </div>
                <code className="text-xs bg-white px-2 py-1 rounded border">
                  {truncateText(device.channel?.apiKeys?.[0]?.apiKey, 2)}
                </code>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <Battery className="w-5 h-5 text-gray-400 mb-1" />
            <span className="text-sm font-bold text-white">
              {device.batteryLevel ?? "?"}
            </span>
            <span className="text-xs text-white">Battery</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <Signal className="w-5 h-5 text-gray-400 mb-1" />
            <span className="text-sm font-bold text-white">
              {device.signal ?? "?"}
            </span>
            <span className="text-xs text-white">Signal</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-gray-400 mb-1" />
            <span className="text-sm font-bold text-white">
              {device.alerts?.length ?? 0}
            </span>
            <span className="text-xs text-white">Alerts</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <Layout className="w-5 h-5 text-gray-400 mb-1" />
            <span className="text-sm font-bold text-white">
              {device.widgets?.length ?? 0}
            </span>
            <span className="text-xs text-white">Widgets</span>
          </div>
        </div>

        {/* Timestamps */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-900 font-bold">
            <Clock className="w-8 h-8" />
            <span>Created: {formatDate(device.createdAt)}</span>
          </div>
          {device.lastPing && (
            <div className="flex items-center gap-2 text-sm text-gray-900">
              <Clock className="w-4 h-4" />
              <span>Last Ping: {formatDate(device.lastPing)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button
            variant="outlined"
            size="small"
            onClick={() => onView(device.id)}
            className="bg-orange-50 text-white hover:bg-black"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onEdit(device.id)}
            className="bg-orange-50 text-white hover:bg-black"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => onDelete(device.id)}
            className="bg-orange-50 text-white hover:bg-black"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
