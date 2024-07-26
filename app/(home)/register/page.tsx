import RegisterUser from "@/components/Auth/authentication3/RegisterUser";
import { Metadata } from "next";

const Register = () => {
  return (
    <div className="mt-8">
      <RegisterUser />
    </div>
  );
};

export default Register;

export const metadata: Metadata = {
  title: "IoTDataCenter - Register",
  description: "Create a new account",
};
