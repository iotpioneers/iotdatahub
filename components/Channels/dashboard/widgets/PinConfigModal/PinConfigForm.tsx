"use client";

import React from "react";
import { Button, TextField, Switch } from "@mui/material";
import ColorPicker from "./ColorPicker";
import { PinConfigFormProps } from "@/types/pin-config";
import { generatePinOptions } from "@/app/utils/pin-config.utils";

const PinConfigForm: React.FC<PinConfigFormProps> = ({
  config,
  widget,
  onConfigChange,
  onDatastreamCreate,
}) => {
  const type = widget.definition?.type;
  const {
    pinType = "VIRTUAL",
    pinNumber = "",
    valueType = "BOOLEAN",
    defaultValue = "",
    minValue = 0,
    maxValue = 100,
    title = widget.name || "",
    showLabels = false,
    hideWidgetName = false,
    onValue = "1",
    offValue = "0",
    widgetColor = "#10B981",
    automationType = "",
  } = config;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">TITLE</label>
        <TextField
          fullWidth
          value={title}
          onChange={(e) => onConfigChange({ ...config, title: e.target.value })}
          variant="outlined"
          size="small"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Datastream</label>
        <p className="text-xs text-gray-500 mb-2">
          Only Integer Datastream can be used
        </p>

        <div className="flex items-center mb-4">
          <TextField
            fullWidth
            select
            SelectProps={{ native: true }}
            value={pinNumber}
            onChange={(e) =>
              onConfigChange({ ...config, pinNumber: e.target.value })
            }
            variant="outlined"
            size="small"
            className="mr-2"
          >
            <option value="">Choose Datastream</option>
            {generatePinOptions(pinType).map((pin) => (
              <option key={pin} value={pin}>
                {pin}
              </option>
            ))}
          </TextField>
          <span className="mx-2">or</span>
          <Button
            variant="contained"
            color="primary"
            onClick={onDatastreamCreate}
            className="bg-teal-500"
            startIcon={<span className="font-bold">+</span>}
          >
            Create Datastream
          </Button>
        </div>

        {(type === "switch" || type === "toggle") && (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  ON VALUE
                </label>
                <TextField
                  fullWidth
                  value={onValue}
                  onChange={(e) =>
                    onConfigChange({ ...config, onValue: e.target.value })
                  }
                  variant="outlined"
                  size="small"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  OFF VALUE
                </label>
                <TextField
                  fullWidth
                  value={offValue}
                  onChange={(e) =>
                    onConfigChange({ ...config, offValue: e.target.value })
                  }
                  variant="outlined"
                  size="small"
                />
              </div>
            </div>

            <div className="flex items-center">
              <Switch
                checked={showLabels}
                onChange={(e) =>
                  onConfigChange({ ...config, showLabels: e.target.checked })
                }
                color="primary"
              />
              <span className="ml-2">Show on/off labels</span>
            </div>

            <div className="flex items-center">
              <Switch
                checked={hideWidgetName}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    hideWidgetName: e.target.checked,
                  })
                }
                color="primary"
              />
              <span className="ml-2">Hide widget name</span>
            </div>
          </div>
        )}

        {valueType === "NUMBER" && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Min Value
              </label>
              <TextField
                fullWidth
                type="number"
                value={minValue}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    minValue: Number(e.target.value),
                  })
                }
                variant="outlined"
                size="small"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Value
              </label>
              <TextField
                fullWidth
                type="number"
                value={maxValue}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    maxValue: Number(e.target.value),
                  })
                }
                variant="outlined"
                size="small"
              />
            </div>
          </div>
        )}

        {(type === "led" || type === "slider" || type === "switch") && (
          <div className="mt-6">
            <ColorPicker
              value={widgetColor}
              onChange={(color) =>
                onConfigChange({ ...config, widgetColor: color })
              }
            />
          </div>
        )}

        {type &&
          valueType === "BOOLEAN" &&
          !["switch", "toggle", "led"].includes(type) && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Default Value
              </label>
              <Switch
                checked={
                  defaultValue !== undefined
                    ? defaultValue === true || defaultValue === "true"
                    : false
                }
                onChange={(e) =>
                  onConfigChange({ ...config, defaultValue: e.target.checked })
                }
                color="primary"
              />
            </div>
          )}

        {(valueType === "NUMBER" || valueType === "STRING") && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">
              Default Value
            </label>
            <TextField
              fullWidth
              value={defaultValue as string}
              onChange={(e) =>
                onConfigChange({ ...config, defaultValue: e.target.value })
              }
              type={valueType === "NUMBER" ? "number" : "text"}
              variant="outlined"
              size="small"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PinConfigForm;
