import React from "react";

const ApiKeys = ({ apiKey }: { apiKey: string }) => {
  return (
    <div className="p-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2">
          {/* Write API Key */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Write API Key</h2>
            <div className="bg-gray-100 p-4 rounded-md border border-gray-300 mb-2">
              <input
                type="text"
                value="6Q58HOU8V7C4E2U"
                readOnly
                className="w-full p-2 bg-gray-200 rounded-md border border-gray-300"
              />
            </div>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-md">
              Generate New Write API Key
            </button>
          </div>

          {/* Read API Keys */}
          <div>
            <h2 className="text-lg font-medium mb-2">Read API Keys</h2>
            <div className="bg-gray-100 p-4 rounded-md border border-gray-300 mb-2">
              <input
                type="text"
                value="8DWVL6VEZNWMP89"
                readOnly
                className="w-full p-2 bg-gray-200 rounded-md border border-gray-300"
              />
              <textarea
                className="w-full mt-2 p-2 bg-gray-200 rounded-md border border-gray-300"
                rows={2}
                placeholder="Note"
              />
            </div>
            <div className="flex space-x-2">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                Save Note
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                Delete API Key
              </button>
            </div>
            <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md">
              Add New Read API Key
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-gray-100 p-4 rounded-md border border-gray-300">
          <h2 className="text-lg font-medium mb-2">Help</h2>
          <p className="text-sm mb-4">
            API keys enable you to write data to a channel or read data from a
            private channel. API keys are auto-generated when you create a new
            channel.
          </p>
          <h3 className="text-md font-medium mb-2">API Key Settings</h3>
          <ul className="list-disc list-inside text-sm mb-4">
            <li>
              <strong>Write API Key:</strong> Use this key to write data to a
              channel.
            </li>
            <li>
              <strong>Read API Key:</strong> Use this key to allow other people
              to view your private channel feeds and charts.
            </li>
          </ul>
          <h3 className="text-md font-medium mb-2">API Requests</h3>
          <div className="text-sm mb-2">
            <p className="font-medium">Write a Channel Feed</p>
            <code className="block bg-gray-200 p-2 rounded-md mb-2">
              POST BASE_URL +
              /api/channels/datapoint?api_key=6Q58HOU8V7C4E2U&field1=
            </code>
          </div>
          <div className="text-sm mb-2">
            <p className="font-medium">Read a Channel Feed</p>
            <code className="block bg-gray-200 p-2 rounded-md mb-2">
              GET BASE_URL + /api/channels/datapoint?api_key=8DWVL6VEZNWMP89
            </code>
          </div>
          <div className="text-sm mb-2">
            <p className="font-medium">Read a Channel Field</p>
            <code className="block bg-gray-200 p-2 rounded-md mb-2">
              GET BASE_URL +
              /api/channels/datapoint?api_key=8DWVL6VEZNWMP89&field1=
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeys;
