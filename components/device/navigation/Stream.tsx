import React from "react";
import LineChartComponent from "../charts/LineChartComponent";
import AddChartComponent from "../charts/AddChartComponent";
// this will be receiving an object where the object will be containing the data and the type of chart we should load for it, the we shall use the switch case to render the correct chart
// the also will be passed to the component as an array of object
const Stream = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <LineChartComponent />
      <LineChartComponent />
      <LineChartComponent />
      <AddChartComponent />
    </div>
  );
};

export default Stream;
