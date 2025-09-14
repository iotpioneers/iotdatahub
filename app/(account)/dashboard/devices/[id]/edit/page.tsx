import { Suspense } from "react";
import EditDashboardComponent from "../../_components/EditDashboardComponent";
import { LinearLoading } from "@/components/LinearLoading";

interface Props {
  params: { id: string };
}

const EditDashboardPage = async ({ params }: Props) => {
  return (
    <Suspense fallback={<LinearLoading />}>
      <EditDashboardComponent params={params} />
    </Suspense>
  );
};

export default EditDashboardPage;
