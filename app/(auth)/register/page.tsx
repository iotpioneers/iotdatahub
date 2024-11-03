import RegistrationFlowComponent from "@/components/Auth/authentication3/RegistrationFlowComponent";
import { Metadata } from "next";

const Register = () => {
  return (
    <div className="mt-8">
      <RegistrationFlowComponent />
    </div>
  );
};

export default Register;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Register",
  description: "Create a new account",
};
