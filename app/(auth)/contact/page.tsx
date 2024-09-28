import React from "react";
import { Metadata } from "next";
import ContactForm from "@/components/Home/components/tech-support/ContactForm";

const ContactUsCreation = () => {
  return <ContactForm />;
};

export default ContactUsCreation;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Contact Us",
  description: "Contact us for support or feedback",
};
