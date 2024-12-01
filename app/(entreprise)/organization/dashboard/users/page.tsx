import { Metadata } from "next";
import OrganizationUserManagement from "../../_components/OrganizationUserManagement";

export default function Page(): React.JSX.Element {
  return <OrganizationUserManagement />;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Users | IoTDataHub - Dashboard",
  description: "Explore our latest features",
};
