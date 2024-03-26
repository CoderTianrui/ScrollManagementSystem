import React, { createContext, useContext, useState } from "react";

type TokenContextProps = {
  children: React.ReactNode;
};

type TokenContextType = {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
};

export const TokenContext = createContext<TokenContextType | null>(null);

export default function TokenProvider({ children }: TokenContextProps) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState<string | null>(null); // Move inside the TokenProvider component

  return (
      <TokenContext.Provider value={{ token, setToken, role, setRole }}>
        {children}
      </TokenContext.Provider>
  );
}

export function useTokenContext() {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useTokenContext must be used within a TokenProvider");
  }
  return context;
}
