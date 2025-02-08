import { useState } from "react";

export const RoomTabs = () => {
  const [activeRoom, setActiveRoom] = useState("Living Room");

  return (
    <div className="flex items-center space-x-4 mb-6">
      {[
        "Living Room",
        "Kitchen Room",
        "Bed Room",
        "Movie Room",
        "Game Room",
      ].map((room) => (
        <button
          key={room}
          onClick={() => setActiveRoom(room)}
          className={`px-4 py-2 rounded-2xl text-sm ${
            activeRoom === room
              ? "bg-blue-500 text-white"
              : "bg-zinc-800 text-gray-300"
          }`}
        >
          {room}
        </button>
      ))}
      <button className="px-4 py-2 rounded-lg bg-orange-50 text-gray-300 text-sm">
        + Add
      </button>
    </div>
  );
};
