import {
  Tv,
  Speaker,
  Router,
  Wifi,
  Flame,
  LightbulbIcon,
  Power,
} from "lucide-react";

export const DeviceStatsDeviceGrid = () => {
  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "tv":
        return <Tv className="w-6 h-6" />;
      case "speaker":
        return <Speaker className="w-6 h-6" />;
      case "router":
        return <Router className="w-6 h-6" />;
      case "wifi":
        return <Wifi className="w-6 h-6" />;
      case "heater":
        return <Flame className="w-6 h-6" />;
      case "socket":
        return <Power className="w-6 h-6" />;
      default:
        return <LightbulbIcon className="w-6 h-6" />;
    }
  };
  return (
    <div className="col-span-6 md:col-span-8">
      <h3 className="text-lg font-semibold mb-4">My Devices</h3>
      <div className="grid grid-cols-3 gap-4">
        {[
          { name: "Smart TV", type: "tv", usage: "5kWh" },
          { name: "Speaker", type: "speaker", usage: "5kWh" },
          { name: "Router", type: "router", usage: "5kWh" },
          { name: "Wifi", type: "wifi", usage: "5kWh" },
          { name: "Heater", type: "heater", usage: "5kWh" },
          { name: "Socket", type: "socket", usage: "5kWh" },
        ].map((device, index) => (
          <div key={index} className="shadow-md shadow-black/50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {getDeviceIcon(device.type)}
                <div>
                  <p className="text-black font-medium">{device.name}</p>
                  <p className="text-gray-600 text-sm">{device.usage}</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-orange-50 rounded-full p-0.5">
                <div className="w-5 h-5 bg-green-500 rounded-full transition-all duration-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
