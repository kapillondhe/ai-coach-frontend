"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface HeaderActionsContextValue {
  actions: ReactNode;
  setActions: (actions: ReactNode) => void;
}

const HeaderActionsContext = createContext<HeaderActionsContextValue | null>(
  null,
);

export const HeaderActionsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [actions, setActions] = useState<ReactNode>(null);
  return (
    <HeaderActionsContext.Provider value={{ actions, setActions }}>
      {children}
    </HeaderActionsContext.Provider>
  );
};

export const useHeaderActions = (): HeaderActionsContextValue => {
  const ctx = useContext(HeaderActionsContext);
  if (!ctx)
    throw new Error(
      "useHeaderActions must be used within a HeaderActionsProvider",
    );
  return ctx;
};

export const usePageHeaderActions = (node: ReactNode) => {
  const { setActions } = useHeaderActions();
  useEffect(() => {
    setActions(node);
    return () => setActions(null);
  }, [node]);
};
