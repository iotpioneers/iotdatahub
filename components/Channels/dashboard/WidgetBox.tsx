import { ChartBarIcon } from "@heroicons/react/20/solid";
import { NumberCircleOne } from "@phosphor-icons/react";
import { SliderIcon, SwitchIcon } from "@radix-ui/react-icons";
import { GaugeIcon } from "lucide-react";
import styles from "@/styles/dashboard.module.css";

const WidgetBox = () => {
  const controlWidgets = [
    { type: "switch", label: "Switch", icon: <SwitchIcon /> },
    { type: "slider", label: "Slider", icon: <SliderIcon /> },
    { type: "numberInput", label: "Number Input", icon: <NumberCircleOne /> },
    // ... other control widgets
  ];

  const displayWidgets = [
    { type: "gauge", label: "Gauge", icon: <GaugeIcon /> },
    { type: "chart", label: "Chart", icon: <ChartBarIcon /> },
    // ... other display widgets
  ];

  return (
    <div>
      <div className={styles.widgetCategory}>CONTROL</div>
      {controlWidgets.map((widget) => (
        <div key={widget.type} className={styles.widgetItem}>
          <div className="flex items-center">
            {widget.icon}
            <span className="ml-3">{widget.label}</span>
          </div>
        </div>
      ))}

      <div className={styles.widgetCategory}>DISPLAY</div>
      {displayWidgets.map((widget) => (
        <div key={widget.type} className={styles.widgetItem}>
          <div className="flex items-center">
            {widget.icon}
            <span className="ml-3">{widget.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WidgetBox;
