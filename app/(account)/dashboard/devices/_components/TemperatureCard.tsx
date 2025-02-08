import React from "react";

const TemperatureCard = () => {
  return (
    <div className="bg-zinc-900 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg">Air Conditioner</h3>
        <div className="w-12 h-6 bg-zinc-700 rounded-full p-0.5">
          <div className="w-5 h-5 bg-blue-500 rounded-full transition-all duration-200" />
        </div>
      </div>
      <div className="text-white text-4xl font-bold mb-6">24°C</div>
      <div className="flex justify-between items-center text-gray-400">
        <span>19°C</span>
        <div className="flex-1 mx-4 h-1 bg-zinc-700 rounded-full">
          <div className="w-1/2 h-full bg-blue-500 rounded-full" />
        </div>
        <span>32°C</span>
      </div>
    </div>
  );
};
export default TemperatureCard;
