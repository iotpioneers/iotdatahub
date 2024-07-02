import { Box, ThemeProvider } from "@mui/material";
import React from "react";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "./utils/theme";
import Navbar from "@/components/Home/components/Navbars/MainNavbar";
import Footer from "@/components/Home/components/Footers/MainFooter";
import HomeBodySections from "@/components/Home/HomeBodySections";
import HomeUpperSections from "@/components/Home/HomeUpperSections";

export default function Home() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {/* Navbar */}
        <Navbar />

        {/* Sections */}

        <HomeUpperSections />
        <Box sx={{ bgcolor: "background.default", position: "relative" }}>
          <HomeBodySections />

          {/* Footer */}
          <Footer />
        </Box>
      </ThemeProvider>
    </div>
  );
}

// import Camp from "@/components/Home/Camp";
// import ContactUs from "@/components/Home/ContactUs";
// import Features from "@/components/Home/Features";
// import Footer from "@/components/Home/Footer";
// import GetApp from "@/components/Home/GetApp";
// import Guide from "@/components/Home/Guide";
// import Hero from "@/components/Home/Hero";
// import Navbar from "@/components/Home/Navbar";

// export default function Home() {
//   return (
//     <div className="w-full">
//       <Navbar />
//       <Hero />
//       <Guide />
//       <Features />
//       <GetApp />
//       <ContactUs />
//       <Footer />
//     </div>
//   );
// }
