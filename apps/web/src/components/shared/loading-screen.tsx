import { Icons } from "../ui/icons";

const LoadingScreen = () => {
  return (
    <div className="flex animate-pulse justify-center p-16">
      <Icons.spinner className="h-8 w-8" />
    </div>
  );
};

export default LoadingScreen;
