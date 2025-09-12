"use client";

import type React from "react";
import { memo, useCallback, useMemo } from "react";
import { ImageIcon, Volume2, PlaySquare, Minus, Plus } from "lucide-react";
import type { WidgetType } from "@/types/widgets";
import { cn } from "@/lib/utils";
import DeviceMap from "@/app/(account)/dashboard/devices/_components/DeviceMap";

//  UI components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Recharts components
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
  Cell,
} from "recharts";
import GaugeWidgetComponent from "../../charts/GaugeWidget";

interface BaseWidgetProps {
  value?: any;
  onChange?: (value: any) => void;
  settings?: {
    max?: number;
    min?: number;
    options?: string[];
    title?: string;
    [key: string]: any;
  };
  className?: string;
  color?: string;
  onClick?: () => void;
  deviceId?: string;
  pinNumber?: number;
}

export const SwitchWidget: React.FC<BaseWidgetProps> = memo(
  ({ value = false, onChange, className, deviceId, pinNumber }) => {
    const handleToggle = useCallback(async () => {
      const newValue = !value;
      onChange?.(newValue);

      if (deviceId && pinNumber !== undefined) {
        try {
          const response = await fetch(
            `/api/devices/${deviceId}/send-command`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                pin: pinNumber,
                value: newValue ? 1 : 0,
                command: "SET_PIN",
              }),
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
          }

          const result = await response.json();

          if (!result.success) {
            throw new Error(result.error || "Command failed");
          }

          console.log("[v0] Switch command sent successfully:", result);
        } catch (error) {
          onChange?.(value);
          console.error("[v0] Failed to update switch hardware:", error);
        }
      }
    }, [value, onChange, deviceId, pinNumber]);

    return (
      <div
        className={cn(
          "flex items-center justify-center h-full w-full p-[4%]",
          className,
        )}
        onClick={handleToggle}
      >
        <div
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
            value ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              value ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </div>
      </div>
    );
  },
);

export const SliderWidget: React.FC<BaseWidgetProps> = memo(
  ({ value = 5, onChange, settings, className, deviceId, pinNumber }) => {
    const min = settings?.min || 0;
    const max = settings?.max || 10;
    const percentage = ((value - min) / (max - min)) * 100;

    const handleValueChange = useCallback(
      async (newValue: number) => {
        onChange?.(newValue);

        if (deviceId && pinNumber !== undefined) {
          try {
            const response = await fetch(
              `/api/devices/${deviceId}/send-command`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  pin: pinNumber,
                  value: newValue,
                  command: "SET_ANALOG",
                }),
              },
            );

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            if (!result.success) {
              throw new Error(result.error || "Command failed");
            }

            console.log("[v0] Slider command sent successfully:", result);
          } catch (error) {
            console.error("[v0] Failed to update slider hardware:", error);
          }
        }
      },
      [onChange, deviceId, pinNumber],
    );

    const handleDecrement = useCallback(() => {
      const newValue = Math.max(min, value - 1);
      handleValueChange(newValue);
    }, [value, min, handleValueChange]);

    const handleIncrement = useCallback(() => {
      const newValue = Math.min(max, value + 1);
      handleValueChange(newValue);
    }, [value, max, handleValueChange]);

    return (
      <div
        className={cn(
          "flex items-center justify-between h-full w-full p-[4%] gap-[2%]",
          className,
        )}
      >
        <span
          className="text-teal-500 text-sm cursor-pointer hover:text-teal-600"
          onClick={handleDecrement}
        >
          −
        </span>
        <div className="flex-1 mx-2 relative">
          <div className="h-1 bg-gray-200 rounded-full">
            <div
              className="h-1 bg-teal-500 rounded-full transition-all duration-200"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-teal-500 rounded-full transition-all duration-200"
            style={{
              left: `${percentage}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
        <span
          className="text-teal-500 text-sm cursor-pointer hover:text-teal-600"
          onClick={handleIncrement}
        >
          +
        </span>
        <span className="text-gray-600 text-sm ml-2">{value}</span>
      </div>
    );
  },
);

export const NumberInputWidget: React.FC<BaseWidgetProps> = memo(
  ({ value = 0, onChange, className, deviceId, pinNumber }) => {
    const sendCommand = useCallback(
      async (newValue: number) => {
        if (deviceId && pinNumber !== undefined) {
          try {
            const response = await fetch(
              `/api/devices/${deviceId}/send-command`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  pin: pinNumber,
                  value: newValue,
                  command: "SET_VALUE",
                }),
              },
            );

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            if (!result.success) {
              throw new Error(result.error || "Command failed");
            }

            console.log("[v0] Number input command sent successfully:", result);
          } catch (error) {
            console.error(
              "[v0] Failed to update number input hardware:",
              error,
            );
          }
        }
      },
      [deviceId, pinNumber],
    );

    const decrement = useCallback(() => {
      const newValue = Number(value) - 1;
      onChange?.(newValue);
      sendCommand(newValue);
    }, [value, onChange, sendCommand]);

    const increment = useCallback(() => {
      const newValue = Number(value) + 1;
      onChange?.(newValue);
      sendCommand(newValue);
    }, [value, onChange, sendCommand]);

    return (
      <div
        className={cn(
          "flex items-center justify-between h-full w-full p-[4%] gap-[2%]",
          className,
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-teal-500 hover:bg-transparent p-0"
          style={{
            width: "clamp(24px, 15%, 48px)",
            height: "clamp(24px, 15%, 48px)",
          }}
          onClick={decrement}
        >
          <Minus style={{ width: "70%", height: "70%" }} />
        </Button>
        <Label
          className="font-light text-gray-700 text-center flex-1"
          style={{ fontSize: "clamp(16px, 6vw, 24px)" }}
        >
          {value}
        </Label>
        <Button
          variant="ghost"
          size="icon"
          className="text-teal-500 hover:bg-transparent p-0"
          style={{
            width: "clamp(24px, 15%, 48px)",
            height: "clamp(24px, 15%, 48px)",
          }}
          onClick={increment}
        >
          <Plus style={{ width: "70%", height: "70%" }} />
        </Button>
      </div>
    );
  },
);

export const LabelWidget: React.FC<BaseWidgetProps> = memo(
  ({ value = "167", className }) => (
    <div
      className={cn(
        "flex items-center justify-center h-full w-full p-[4%] gap-[2%]",
        className,
      )}
    >
      <div
        className="bg-blue-600 rounded-full"
        style={{
          width: "clamp(4px, 2%, 8px)",
          height: "60%",
        }}
      />
      <Label
        className="font-bold text-gray-800 text-center flex-1"
        style={{ fontSize: "clamp(16px, 6vw, 28px)" }}
      >
        {value}
      </Label>
    </div>
  ),
);

export const GaugeWidget: React.FC<BaseWidgetProps> = memo(
  ({ value = 82, settings, className }) => {
    const min = settings?.min || 0;
    const max = settings?.max || 100;

    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center h-full w-full",
          className,
        )}
      >
        <div className="relative w-full h-[85%] flex items-center justify-center">
          <GaugeWidgetComponent
            chartData={[
              {
                id: "gauge-circle",
                value,
                timestamp: Date.now().toString(),
              },
            ]}
            WidgetType="grafana"
          />
        </div>
      </div>
    );
  },
);

export const RadialGaugeWidget: React.FC<BaseWidgetProps> = memo(
  ({ value = 42, settings, className }) => {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center h-full w-full p-[4%]",
          className,
        )}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <GaugeWidgetComponent
            chartData={[
              {
                id: "gauge",
                value,
                timestamp: Date.now().toString(),
              },
            ]}
          />
        </div>
      </div>
    );
  },
);

export const ImageButtonWidget: React.FC<BaseWidgetProps> = memo(
  ({ className, onChange, deviceId, pinNumber }) => (
    <div
      className={cn(
        "flex items-center justify-center h-full w-full p-[4%]",
        className,
      )}
    >
      <Button
        variant="outline"
        size="icon"
        className="border-teal-400 hover:bg-teal-50 transition-colors p-0 bg-transparent"
        style={{
          width: "clamp(72px, 60%, 192px)",
          height: "clamp(72px, 60%, 192px)",
        }}
        onClick={() => onChange?.(true)}
      >
        <ImageIcon
          style={{ width: "50%", height: "50%" }}
          className="text-teal-400"
        />
      </Button>
    </div>
  ),
);

export const VideoWidget: React.FC<BaseWidgetProps> = memo(({ className }) => (
  <div
    className={cn(
      "flex items-center justify-center h-full w-full p-[4%]",
      className,
    )}
  >
    <PlaySquare
      className="text-gray-600"
      style={{
        width: "clamp(48px, 45%, 144px)",
        height: "clamp(48px, 45%, 144px)",
      }}
    />
  </div>
));

export const AudioWidget: React.FC<BaseWidgetProps> = memo(({ className }) => (
  <div
    className={cn(
      "flex items-center justify-center h-full w-full p-[4%]",
      className,
    )}
  >
    <div
      className="rounded-full flex items-center justify-center bg-green-100 transition-colors"
      style={{
        width: "clamp(24px, 20%, 64px)",
        height: "clamp(24px, 20%, 64px)",
      }}
    >
      <Volume2
        className="text-green-500"
        style={{ width: "50%", height: "50%" }}
      />
    </div>
  </div>
));

export const ImageGalleryWidget: React.FC<BaseWidgetProps> = memo(
  ({ value = [], className }) => (
    <div
      className={cn(
        "flex items-center justify-center h-full w-full p-[4%]",
        className,
      )}
    >
      <div className="relative">
        <div
          className="border border-teal-400 rounded flex items-center justify-center transition-colors"
          style={{
            width: "clamp(72px, 45%, 144px)",
            height: "clamp(54px, 36%, 108px)",
          }}
        >
          <ImageIcon
            className="text-teal-400"
            style={{ width: "60%", height: "60%" }}
          />
        </div>
        <div
          className="absolute border border-teal-400 rounded bg-white flex items-center justify-center"
          style={{
            width: "clamp(60px, 36%, 120px)",
            height: "clamp(45px, 30%, 90px)",
            top: "clamp(-6px, -15%, -12px)",
            right: "clamp(-6px, -15%, -12px)",
          }}
        >
          <ImageIcon
            className="text-teal-400"
            style={{ width: "50%", height: "50%" }}
          />
        </div>
      </div>
    </div>
  ),
);

export const CustomChartWidget: React.FC<BaseWidgetProps> = memo(
  ({ value = [], className }) => {
    const data = useMemo(
      () => [
        { x: 0, y: 0 },
        { x: 1, y: 45 },
        { x: 2, y: 25 },
        { x: 3, y: 55 },
        { x: 4, y: 40 },
        { x: 5, y: 100 },
        { x: 6, y: 50 },
      ],
      [],
    );

    return (
      <div className={cn("h-full w-full p-[4%]", className)}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient
                id="customLineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgb(34, 197, 94)" />
                <stop offset="50%" stopColor="rgb(59, 130, 246)" />
                <stop offset="100%" stopColor="rgb(168, 85, 247)" />
              </linearGradient>
            </defs>
            <Line
              type="linear"
              dataKey="y"
              stroke="url(#customLineGradient)"
              strokeWidth="clamp(1, 0.3vw, 4)"
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  },
);

export const HeatmapChartWidget: React.FC<BaseWidgetProps> = memo(
  ({ value = [], className }) => (
    <div className={cn("h-full w-full p-[4%] flex flex-col", className)}>
      <Label
        className="font-medium text-gray-700 mb-[2%]"
        style={{ fontSize: "clamp(10px, 3vw, 16px)" }}
      >
        Timeline
      </Label>
      <div className="flex items-center gap-[2%] mb-[3%] flex-1 max-h-[20%]">
        <div
          className="bg-blue-400 rounded-sm transition-colors h-full"
          style={{ width: "30%" }}
        />
        <div
          className="bg-gray-300 rounded-sm transition-colors h-full"
          style={{ width: "15%" }}
        />
        <div
          className="bg-gray-200 rounded-sm transition-colors h-full"
          style={{ width: "45%" }}
        />
      </div>
      <div
        className="flex justify-between text-gray-400"
        style={{ fontSize: "clamp(8px, 2.5vw, 14px)" }}
      >
        <span>08:26 AM</span>
        <span>09:00 AM</span>
      </div>
    </div>
  ),
);

export const ChartWidget: React.FC<BaseWidgetProps> = memo(
  ({ value = [], className }) => {
    const data = useMemo(
      () => [
        { name: "1", value: 4 },
        { name: "2", value: 7 },
        { name: "3", value: 3 },
        { name: "4", value: 8 },
        { name: "5", value: 2 },
        { name: "6", value: 6 },
        { name: "7", value: 4 },
      ],
      [],
    );

    return (
      <div className={cn("h-full w-full p-[4%] flex flex-col", className)}>
        <div className="h-[85%]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap={2}>
              <Bar dataKey="value" radius={4}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="rgb(59, 130, 246)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div
          className="flex justify-between text-gray-400 h-[15%] items-center"
          style={{ fontSize: "clamp(8px, 2.5vw, 14px)" }}
        >
          <span>8:26 AM</span>
          <span>8:43 AM</span>
        </div>
      </div>
    );
  },
);

export const LedWidget: React.FC<BaseWidgetProps> = memo(
  ({ value = true, className }) => (
    <div
      className={cn(
        "flex items-center justify-center h-full w-full p-[4%]",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-full transition-all duration-300",
          value ? "bg-green-500 shadow-md shadow-green-500/50" : "bg-gray-300",
        )}
        style={{
          width: "clamp(24px, 25%, 80px)",
          height: "clamp(24px, 25%, 80px)",
        }}
      />
    </div>
  ),
);

export const AlarmSoundWidget: React.FC<BaseWidgetProps> = memo(
  ({ value = false, className }) => (
    <div
      className={cn(
        "flex items-center justify-center h-full w-full p-[4%]",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-full flex items-center justify-center transition-colors",
          value ? "bg-red-100" : "bg-green-100",
        )}
        style={{
          width: "clamp(72px, 60%, 192px)",
          height: "clamp(72px, 60%, 192px)",
        }}
      >
        <Volume2
          className={cn(
            "transition-colors",
            value ? "text-red-500" : "text-green-500",
          )}
          style={{ width: "50%", height: "50%" }}
        />
      </div>
    </div>
  ),
);

export const TerminalWidget: React.FC<BaseWidgetProps> = memo(
  ({ value = "", className }) => (
    <div
      className={cn("h-full w-full p-[4%] flex flex-col gap-[3%]", className)}
    >
      <div
        className="bg-black text-white rounded font-mono p-[3%] flex-1"
        style={{ fontSize: "clamp(8px, 2.5vw, 14px)" }}
      >
        &lt; Power On Power Off Enabled
      </div>
      <div
        className="bg-black text-white rounded font-mono p-[3%] flex-1"
        style={{ fontSize: "clamp(8px, 2.5vw, 14px)" }}
      >
        Type here
      </div>
    </div>
  ),
);

export const TextInputWidget: React.FC<BaseWidgetProps> = memo(
  ({ value = "Zero", onChange, className, deviceId, pinNumber }) => {
    const handleInputChange = useCallback(
      async (newValue: string) => {
        onChange?.(newValue);

        if (deviceId && pinNumber !== undefined) {
          try {
            const response = await fetch(
              `/api/devices/${deviceId}/send-command`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  pin: pinNumber,
                  value: newValue,
                  command: "SET_TEXT",
                }),
              },
            );

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            if (!result.success) {
              throw new Error(result.error || "Command failed");
            }

            console.log("[v0] Text input command sent successfully:", result);
          } catch (error) {
            console.error("[v0] Failed to update text input hardware:", error);
          }
        }
      },
      [onChange, deviceId, pinNumber],
    );

    return (
      <div
        className={cn(
          "flex items-center justify-center h-full w-full p-[4%]",
          className,
        )}
      >
        <Input
          type="text"
          placeholder="Zero"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          className="w-full border border-gray-300"
          style={{
            height: "clamp(32px, 15%, 64px)",
            fontSize: "clamp(14px, 5vw, 20px)",
            padding: "0 clamp(8px, 4%, 16px)",
          }}
        />
      </div>
    );
  },
);

export const SegmentedSwitchWidget: React.FC<BaseWidgetProps> = memo(
  ({ value = 0, onChange, settings, className, deviceId, pinNumber }) => {
    const options = settings?.options || ["Zero", "One"];

    const handleOptionChange = useCallback(
      async (newValue: number) => {
        onChange?.(newValue);

        if (deviceId && pinNumber !== undefined) {
          try {
            const response = await fetch(
              `/api/devices/${deviceId}/send-command`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  pin: pinNumber,
                  value: newValue,
                  command: "SET_OPTION",
                }),
              },
            );

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            if (!result.success) {
              throw new Error(result.error || "Command failed");
            }

            console.log(
              "[v0] Segmented switch command sent successfully:",
              result,
            );
          } catch (error) {
            console.error(
              "[v0] Failed to update segmented switch hardware:",
              error,
            );
          }
        }
      },
      [onChange, deviceId, pinNumber],
    );

    return (
      <div
        className={cn(
          "flex items-center justify-center h-full w-full p-[4%]",
          className,
        )}
      >
        <div className="flex bg-gray-100 rounded overflow-hidden w-full h-full">
          {options.map((option, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={cn(
                "flex-1 h-full rounded-none transition-all duration-200",
                value === index
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "text-gray-700 hover:bg-gray-200",
              )}
              style={{
                fontSize: "clamp(8px, 2.5vw, 14px)",
                padding: "0 clamp(2px, 1%, 8px)",
              }}
              onClick={() => handleOptionChange(index)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    );
  },
);

export const MenuWidget: React.FC<BaseWidgetProps> = memo(
  ({ value = "Zero", onChange, settings, className, deviceId, pinNumber }) => {
    const options = settings?.options || ["Zero", "One", "Two"];

    const handleMenuChange = useCallback(
      async (newValue: string) => {
        onChange?.(newValue);

        if (deviceId && pinNumber !== undefined) {
          try {
            const response = await fetch(
              `/api/devices/${deviceId}/send-command`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  pin: pinNumber,
                  value: newValue,
                  command: "SET_MENU",
                }),
              },
            );

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            if (!result.success) {
              throw new Error(result.error || "Command failed");
            }

            console.log("[v0] Menu command sent successfully:", result);
          } catch (error) {
            console.error("[v0] Failed to update menu hardware:", error);
          }
        }
      },
      [onChange, deviceId, pinNumber],
    );

    return (
      <div
        className={cn(
          "flex items-center justify-center h-full w-full p-[4%]",
          className,
        )}
      >
        <Select value={value} onValueChange={handleMenuChange}>
          <SelectTrigger
            className="w-full border border-gray-300"
            style={{
              height: "clamp(32px, 15%, 64px)",
              fontSize: "clamp(14px, 5vw, 20px)",
              padding: "0 clamp(8px, 4%, 16px)",
            }}
          >
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, index) => (
              <SelectItem
                key={index}
                value={option}
                style={{ fontSize: "clamp(14px, 5vw, 20px)" }}
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
);

export const ModulesWidget: React.FC<BaseWidgetProps> = memo(
  ({ value = {}, className }) => (
    <div
      className={cn("h-full w-full p-[4%] flex flex-col gap-[3%]", className)}
    >
      <div className="flex items-center justify-between flex-1 pr-[2%]">
        <Label
          className="text-gray-700 flex-1"
          style={{ fontSize: "clamp(10px, 3vw, 16px)" }}
        >
          Switch
        </Label>
        <div className="flex-shrink-0">
          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500">
            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between flex-1">
        <Label
          className="text-gray-700"
          style={{ fontSize: "clamp(10px, 3vw, 16px)" }}
        >
          Label
        </Label>
        <Label
          className="text-gray-600"
          style={{ fontSize: "clamp(10px, 3vw, 16px)" }}
        >
          String
        </Label>
      </div>
    </div>
  ),
);

const components: Record<WidgetType, React.FC<BaseWidgetProps>> = {
  switch: SwitchWidget,
  slider: SliderWidget,
  numberInput: NumberInputWidget,
  imageButton: ImageButtonWidget,
  webPageImage: ImageButtonWidget,
  label: LabelWidget,
  gauge: GaugeWidget,
  radialGauge: RadialGaugeWidget,
  chart: ChartWidget,
  video: VideoWidget,
  imageGallery: ImageGalleryWidget,
  customChart: CustomChartWidget,
  heatmapChart: HeatmapChartWidget,
  map: () => <DeviceMap />,
  alarmSound: AlarmSoundWidget,
  led: LedWidget,
  textInput: TextInputWidget,
  terminal: TerminalWidget,
  toggle: SwitchWidget,
  segmentedSwitch: SegmentedSwitchWidget,
  menu: MenuWidget,
  modules: ModulesWidget,
};

export default memo(function WidgetRegistry({
  type,
  className,
  ...props
}: { type: WidgetType } & BaseWidgetProps) {
  const Component = components[type] || LabelWidget;
  return <Component className={className} {...props} />;
});

SwitchWidget.displayName = "SwitchWidget";
SliderWidget.displayName = "SliderWidget";
NumberInputWidget.displayName = "NumberInputWidget";
LabelWidget.displayName = "LabelWidget";
GaugeWidget.displayName = "GaugeWidget";
RadialGaugeWidget.displayName = "RadialGaugeWidget";
ImageButtonWidget.displayName = "ImageButtonWidget";
VideoWidget.displayName = "VideoWidget";
AudioWidget.displayName = "AudioWidget";
ImageGalleryWidget.displayName = "ImageGalleryWidget";
CustomChartWidget.displayName = "CustomChartWidget";
HeatmapChartWidget.displayName = "HeatmapChartWidget";
ChartWidget.displayName = "ChartWidget";
LedWidget.displayName = "LedWidget";
AlarmSoundWidget.displayName = "AlarmSoundWidget";
TerminalWidget.displayName = "TerminalWidget";
TextInputWidget.displayName = "TextInputWidget";
SegmentedSwitchWidget.displayName = "SegmentedSwitchWidget";
MenuWidget.displayName = "MenuWidget";
ModulesWidget.displayName = "ModulesWidget";
