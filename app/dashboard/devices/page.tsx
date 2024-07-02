import React from "react";
import dynamic from "next/dynamic";

const DeviceList = dynamic(() => import("./_components/DeviceLists"), {
  ssr: false,
});

const Devices = () => {
  return <DeviceList />;
};

export default Devices;
