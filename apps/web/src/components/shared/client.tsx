import { type FC, type ReactNode, useEffect, useState } from "react";

const Client: FC<{ children: ReactNode }> = ({ children }) => {
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    setRendered(true);
  }, []);

  if (!rendered) return <></>;
  return <>{children}</>;
};

export default Client;
