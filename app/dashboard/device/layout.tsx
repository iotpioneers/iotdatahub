import PageHeading from "@/components/device/PageHeading";

export default function DeviceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
