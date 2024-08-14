import * as React from "react";
import Container from "@mui/material/Container";
import MainFeaturedPost from "@/components/Home/Blogs/MainFeaturedPost";
import { Metadata } from "next";

export default function Blog() {
  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      <main>
        <MainFeaturedPost />
      </main>
    </Container>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Blogs",
  description: "Discover our latest blog posts",
};
