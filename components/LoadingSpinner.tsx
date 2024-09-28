import Image from "next/image";

const LoadingSpinner = () => {
  return (
    <div className="loader">
      <Image
        src="/icons/loader.svg"
        alt="loader"
        width={44}
        height={44}
        priority
        className="animate-spin"
      />
      Loading...
    </div>
  );
};

export default LoadingSpinner;
