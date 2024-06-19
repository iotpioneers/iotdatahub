import Camp from "@/components/Home/Camp";
import Features from "@/components/Home/Features";
import Footer from "@/components/Home/Footer";
import GetApp from "@/components/Home/GetApp";
import Guide from "@/components/Home/Guide";
import Hero from "@/components/Home/Hero";
import Navbar from "@/components/Home/Navbar";

export default function Home() {
  return (
    <div className="mt-5">
      <Navbar />
      <Hero />
      <Camp />
      <Footer />

      {/* <Guide />
      <Features />
      <GetApp /> */}
    </div>
  );
}
