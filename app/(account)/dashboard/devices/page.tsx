// import React, { Suspense } from "react";
// import DeviceList from "./_components/DeviceLists";
// import { Metadata } from "next";
// import LoadingSpinner from "@/components/LoadingSpinner";

// const Devices = () => {
//   return (
//     <Suspense fallback={<LoadingSpinner />}>
//       <DeviceList />;
//     </Suspense>
//   );
// };

// export const dynamic = "force-dynamic";

// export const metadata: Metadata = {
//   title: "Ten2Ten - Device List",
//   description: "View all project devices",
// };

// export default Devices;

import { Suspense } from "react";
import DeviceTable from "./_components/DevicesTable";
import { Metadata } from "next";
import LoadingSpinner from "@/components/LoadingSpinner";

// interface Props {
//   searchParams: deviceQuery;
// }

const DeviceListingsPage = async () => {
  // const statuses = Object.values(DeviceStatus);
  // const status = statuses.includes(searchParams.status)
  //   ? searchParams.status
  //   : undefined;
  // const where = { status };

  // const orderBy = columnNames.includes(searchParams.orderBy)
  //   ? { [searchParams.orderBy]: "asc" }
  //   : undefined;

  // const page = parseInt(searchParams.page) || 1;
  // const pageSize = 10;

  // const devices = await prisma.device.findMany({
  //   where,
  //   orderBy,
  //   skip: (page - 1) * pageSize,
  //   take: pageSize,
  // });

  // const deviceCount = await prisma.device.count({ where });

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DeviceTable />
    </Suspense>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ten2Ten - Device List",
  description: "View all project devices",
};

export default DeviceListingsPage;
