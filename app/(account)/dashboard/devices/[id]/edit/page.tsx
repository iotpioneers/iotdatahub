import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import EditDashboardComponent from "../../_components/EditDashboardComponent";

interface Props {
  params: { id: string };
}

const EditDashboardPage = async ({ params }: Props) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EditDashboardComponent params={params} />
    </Suspense>
  );
};

export default EditDashboardPage;
