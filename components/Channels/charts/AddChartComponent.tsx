import React from "react";

const AddChartComponent = () => {
  return (
    <div className="w-full max-w-md p-9 lg:ml-16">
      <div className="p-8 text-center rounded-lg border-dashed border-2 border-gray-300 hover:border-primary-blue transition duration-300">
        <label className="cursor-pointer flex flex-col items-center space-y-2">
          <svg
            className="w-16 h-16 text-primary-blue"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          <span className="text-gray-900">Add Chart</span>
          <span className="text-gray-500 text-sm">(Click to add)</span>
        </label>
        <input type="file" id="fileInput" className="hidden" multiple />
      </div>
      <div className="mt-6 text-center" id="fileList"></div>
    </div>
  );
};

export default AddChartComponent;
