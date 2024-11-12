import { Metadata } from "next";

import ContactSales from "@/components/dashboard/account/subscription/ContactSales";

const ContactSalesPage = () => {
  return <ContactSales />;
};

export default ContactSalesPage;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Contact Sales",
  description: "Contact sales for support or feedback",
};
