import React from "react";
import { Card, CardContent, Switch } from "@mui/material";
import { LightbulbIcon } from "lucide-react";

const LightControls = () => {
  return (
    <div className="col-span-6: md:col-span-4">
      <h3 className="text-lg font-semibold mb-4">Light</h3>
      <div className="space-y-4">
        {[1, 2, 3].map((light) => (
          <div key={light} className="bg-zinc-800 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <LightbulbIcon className="w-6 h-6 text-gray-400" />
                <span className="text-white">Light {light}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-zinc-700 rounded-full">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: "65%" }}
                  />
                </div>
                <span className="text-gray-400 text-sm">65%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LightControls;
