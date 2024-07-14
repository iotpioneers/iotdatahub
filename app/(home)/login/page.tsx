import LoginForm from "@/components/Forms/LoginForm";
import { Metadata } from "next";

const Login = () => {
  return (
    <div className="mt-12">
      <LoginForm />;
    </div>
  );
};

export default Login;

export const metadata: Metadata = {
  title: "Ten2Ten - Login",
  description: "Signin to your account",
};
