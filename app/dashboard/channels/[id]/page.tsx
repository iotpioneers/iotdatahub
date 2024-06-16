import Navigation from "@/components/device/Navigation";
import PageHeading from "@/components/device/PageHeading";

interface Props {
  params: { id: string };
}

export default function Device({ params }: Props) {
  return (
    <main className="overflow-hidden">
      <PageHeading channelId={params.id} />
      <div className="mt-10 border-t border-gray-200"></div>
      <Navigation />
    </main>
  );
}
