import { Loader } from "lucide-react";
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader
        className="animate-spin"
        size={150}
        color="rgba(0, 136,202,0.75)"
      />
    </div>
  );
};

export default LoadingSpinner;
