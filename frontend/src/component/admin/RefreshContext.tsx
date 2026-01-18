import { createContext, useContext, useState } from "react";
import type { ReactNode } from 'react';

type RefreshContextType = {
  refreshKey: number;
  triggerRefresh: () => void;
};

const RefreshContext = createContext<RefreshContextType>({
  refreshKey: 0,
  triggerRefresh: () => {},
});

export const useRefresh = () => useContext(RefreshContext);

export const RefreshProvider = ({ children }: { children: ReactNode }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <RefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};
