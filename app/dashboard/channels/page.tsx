import React, { Suspense } from "react";
import Projects from "@/components/dashboard/Projects";
import LoadingSpinner from "@/components/LoadingSpinner";

const ChannelsPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Projects />
    </Suspense>
  );
};

export default ChannelsPage;
