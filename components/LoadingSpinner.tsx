import { Loader } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
    >
      <Loader
        className="animate-spin"
        size={150}
        color="rgba(0, 136, 202, 1)"
      />
    </div>
  );
};

export default LoadingSpinner;
