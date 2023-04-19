import Loading from "./loading";

const LoadingScreen = () => {
  return (
    <div className="flex animate-pulse justify-center p-16">
      <Loading size={8} />
    </div>
  );
};

export default LoadingScreen;
