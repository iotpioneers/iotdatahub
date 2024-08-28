import React from "react";
import NewFieldNestedModal from "./NewFieldNestedModal";

const AddChartComponent = () => {
  return (
    <div className="w-full max-w-md p-9 lg:ml-16">
      <div className="p-8 text-center rounded-lg border-dashed border-2 border-gray-300 hover:border-primary-blue transition duration-300">
        <label className="cursor-pointer flex flex-col items-center space-y-2">
          <NewFieldNestedModal />
          <span className="text-gray-500 text-sm">(Click to add)</span>
        </label>
        <input type="file" id="fileInput" className="hidden" multiple />
      </div>
      <div className="mt-6 text-center" id="fileList"></div>
    </div>
  );
};

export default AddChartComponent;
