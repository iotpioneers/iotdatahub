import { CustomFilter, Footer, Hero, Navbar, SearchBar } from "@/components";
import Image from "next/image";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Navbar />
      <Hero />

      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Our Tools</h1>
          <p>Explore the tools we got for you</p>
        </div>

        {/* <div className="home__filters">
          <SearchBar />
        </div> */}
      </div>
      <Footer />
    </main>
  );
}
