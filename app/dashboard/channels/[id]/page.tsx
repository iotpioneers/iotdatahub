import Navigation from "@/components/device/Navigation";
import PageHeading from "@/components/device/PageHeading";

interface Props {
  searchParams: { id: string };
}

export default function Device({ searchParams: { id } }: Props) {
  return (
    <main className="overflow-hidden">
      <PageHeading channelId={id} />
      <div className="mt-10 border-t border-gray-200"></div>
      <Navigation />
    </main>
  );
}
