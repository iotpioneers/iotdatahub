import { Box } from "@radix-ui/themes";
import Skeleton from "./Skeleton";

const LoadingIssueDetailPage = () => {
  return (
    <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton height={220} width={400} />
      <Skeleton height={220} width={400} />
      <Skeleton height={220} width={400} />
      <Skeleton height={220} width={400} />
    </Box>
  );
};

export default LoadingIssueDetailPage;
