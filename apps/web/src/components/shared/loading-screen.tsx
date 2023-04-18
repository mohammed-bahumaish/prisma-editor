import Loading from "./loading";

const LoadingScreen = () => {
  return (
    <div className="flex animate-pulse justify-center p-8">
      <div className="flex  items-center sm:justify-start">
        <div className="flex flex-shrink-0 items-center gap-4">
          <Loading />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
