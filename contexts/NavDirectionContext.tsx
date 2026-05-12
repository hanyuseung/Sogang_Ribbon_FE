"use client";

import { createContext, useContext, useState } from "react";

type NavDirectionContextType = {
  direction: number;
  setDirection: (dir: number) => void;
};

const NavDirectionContext = createContext<NavDirectionContextType>({
  direction: 1,
  setDirection: () => {},
});

export function NavDirectionProvider({ children }: { children: React.ReactNode }) {
  const [direction, setDirection] = useState(1);
  return (
    <NavDirectionContext.Provider value={{ direction, setDirection }}>
      {children}
    </NavDirectionContext.Provider>
  );
}

export function useNavDirection() {
  return useContext(NavDirectionContext);
}
