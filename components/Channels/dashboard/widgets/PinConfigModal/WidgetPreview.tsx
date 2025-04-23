"use client";

import { WidgetPreviewProps } from "@/types/pin-config";
import React from "react";
import {
  Gauge,
  SlidersHorizontal,
  ToggleLeft,
  Image as ImageIcon,
  Video,
  Bell,
  Play,
  Terminal,
  Circle,
  Sun,
  Lightbulb,
  AlertTriangle,
  Type,
  Grid,
  Menu,
} from "lucide-react";

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ widget, config }) => {
  const type = widget.definition?.type;
  const {
    title,
    widgetColor = "#10B981",
    hideWidgetName,
    showLabels,
    value,
    defaultValue,
  } = config;

  const currentValue = value !== undefined ? value : defaultValue;

  const renderSwitchPreview = () => (
    <div className="flex justify-center items-center h-16 mt-4">
      <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
        <div
          className="absolute inset-y-0 w-6 h-6 rounded-full transform transition-transform"
          style={{
            backgroundColor: widgetColor,
            left: currentValue ? "50%" : "0%",
          }}
        />
      </div>
      {showLabels && (
        <span className="ml-2">{currentValue ? "ON" : "OFF"}</span>
      )}
    </div>
  );

  const renderSliderPreview = () => (
    <div className="w-full px-4 mt-4">
      <input
        type="range"
        min={config.minValue || 0}
        max={config.maxValue || 100}
        value={(currentValue as number) || 50}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        style={{ accentColor: widgetColor }}
        readOnly
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{config.minValue || 0}</span>
        <span>{currentValue || 50}</span>
        <span>{config.maxValue || 100}</span>
      </div>
    </div>
  );

  const renderGaugePreview = () => (
    <div className="flex justify-center items-center h-24">
      <div className="relative w-24 h-12">
        <div className="absolute w-full h-2 bg-gray-200 rounded-full top-6"></div>
        <div
          className="absolute h-2 rounded-full top-6"
          style={{
            width: `${(((currentValue as number) || 50) / (config.maxValue || 100)) * 100}%`,
            backgroundColor: widgetColor,
          }}
        />
        <div className="absolute top-0 left-0 right-0 flex justify-center">
          <div className="text-sm font-medium">{currentValue || 50}</div>
        </div>
      </div>
    </div>
  );

  const renderRadialGaugePreview = () => {
    const percentage =
      (((currentValue as number) || 50) / (config.maxValue || 100)) * 100;
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex justify-center items-center h-24">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke="#E5E7EB"
            strokeWidth="4"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={widgetColor}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  };

  const renderLedPreview = () => (
    <div className="flex justify-center items-center h-24">
      <div
        className="w-12 h-12 rounded-full shadow-lg"
        style={{
          backgroundColor: currentValue ? widgetColor : `${widgetColor}30`,
          boxShadow: currentValue ? `0 0 10px ${widgetColor}` : "none",
        }}
      />
    </div>
  );

  const renderAlarmPreview = () => (
    <div className="flex justify-center items-center h-24">
      <div className="relative">
        <Bell
          className="w-8 h-8"
          style={{
            color: currentValue ? "#EF4444" : "#9CA3AF",
          }}
        />
        {currentValue && (
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-75"
            style={{ backgroundColor: "#EF4444" }}
          />
        )}
      </div>
    </div>
  );

  const renderTerminalPreview = () => (
    <div className="h-24 bg-gray-900 rounded p-2">
      <div className="flex items-center mb-1">
        <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
      </div>
      <div className="font-mono text-xs text-green-400 overflow-hidden">
        {"> Ready for commands..."}
      </div>
    </div>
  );

  const renderSegmentedSwitchPreview = () => {
    const options = config.options || ["Opt 1", "Opt 2", "Opt 3"];
    return (
      <div className="flex justify-center items-center h-16 mt-2">
        <div className="flex border rounded-lg overflow-hidden divide-x">
          {options.map((option, index) => (
            <div
              key={index}
              className={`px-2 py-1 text-xs ${
                currentValue === index ? "font-medium" : "text-gray-500"
              }`}
              style={{
                backgroundColor:
                  currentValue === index ? `${widgetColor}20` : "transparent",
                color: currentValue === index ? widgetColor : "inherit",
              }}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMenuPreview = () => {
    const options = config.options || ["Menu 1", "Menu 2", "Menu 3"];
    return (
      <div className="h-24 overflow-y-auto p-1">
        {options.map((option, index) => (
          <div
            key={index}
            className={`px-2 py-1 my-1 rounded text-sm ${
              currentValue === option ? "font-medium" : "text-gray-500"
            }`}
            style={{
              backgroundColor:
                currentValue === option ? `${widgetColor}20` : "transparent",
              color: currentValue === option ? widgetColor : "inherit",
            }}
          >
            {option}
          </div>
        ))}
      </div>
    );
  };

  const renderDefaultPreview = () => {
    const iconMap = {
      switch: <ToggleLeft className="w-8 h-8" />,
      slider: <SlidersHorizontal className="w-8 h-8" />,
      gauge: <Gauge className="w-8 h-8" />,
      radialGauge: <Circle className="w-8 h-8" />,
      led: <Lightbulb className="w-8 h-8" />,
      alarmSound: <AlertTriangle className="w-8 h-8" />,
      terminal: <Terminal className="w-8 h-8" />,
      textInput: <Type className="w-8 h-8" />,
      segmentedSwitch: <Grid className="w-8 h-8" />,
      menu: <Menu className="w-8 h-8" />,
      default: <div className="w-8 h-8 rounded bg-gray-200" />,
    };

    const icon = iconMap[type as keyof typeof iconMap] || iconMap.default;

    return (
      <div className="flex flex-col items-center justify-center h-24">
        <div className="mb-2" style={{ color: widgetColor }}>
          {icon}
        </div>
        <div className="text-xs text-gray-500">{type}</div>
      </div>
    );
  };

  return (
    <div className="rounded-md border shadow p-4 bg-white w-64">
      {!hideWidgetName && (
        <div className="text-center font-medium truncate">
          {title || widget.name || type}
        </div>
      )}

      {type === "switch" && renderSwitchPreview()}
      {type === "slider" && renderSliderPreview()}
      {type === "gauge" && renderGaugePreview()}
      {type === "radialGauge" && renderRadialGaugePreview()}
      {type === "led" && renderLedPreview()}
      {type === "alarmSound" && renderAlarmPreview()}
      {type === "terminal" && renderTerminalPreview()}
      {type === "segmentedSwitch" && renderSegmentedSwitchPreview()}
      {type === "menu" && renderMenuPreview()}
      {![
        "switch",
        "slider",
        "gauge",
        "radialGauge",
        "led",
        "alarmSound",
        "terminal",
        "segmentedSwitch",
        "menu",
      ].includes(type as string) && renderDefaultPreview()}
    </div>
  );
};

export default WidgetPreview;
