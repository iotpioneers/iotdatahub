import RegisterForm from "@/components/Forms/RegisterForm";
import { Metadata } from "next";

const Register = () => {
  return (
    <div className="mt-12">
      <RegisterForm />;
    </div>
  );
};

export default Register;

export const metadata: Metadata = {
  title: "ARTISAN - Register",
  description: "Create a new account",
};
