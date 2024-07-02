import dynamic from "next/dynamic";

interface Props {
  params: { id: string };
}

const DeviceDetails = dynamic(() => import("../_components/DeviceDetails"), {
  ssr: false,
});

const DeviceDetailsPage = async ({ params }: Props) => {
  return <DeviceDetails params={params} />;
};

export default DeviceDetailsPage;
