import Image from "next/image";

const LoadingSpinner = () => {
  return (
    <div className="loader">
      <Image
        src="/icons/loader.svg"
        alt="loader"
        width={44}
        height={44}
        className="animate-spin mr-1"
      />
      Loading...
    </div>
  );
};

export default LoadingSpinner;
