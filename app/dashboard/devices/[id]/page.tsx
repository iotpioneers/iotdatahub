import { notFound } from "next/navigation";
import React from "react";

interface Props {
  params: { id: string };
}

const DeviceDetailsPage = ({ params }: Props) => {
  if (!params.id) notFound();
  return <div>DeviceDetailsPage</div>;
};

export default DeviceDetailsPage;
