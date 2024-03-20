import Navigation from "@/components/device/Navigation";
import PageHeading from "@/components/device/PageHeading";

export default function Device() {
  return (
    <main className="overflow-hidden">
      <PageHeading />
      <div className="mt-10 border-t border-gray-200"></div>
      <Navigation />
    </main>
  );
}
