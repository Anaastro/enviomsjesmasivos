import React, { createContext, useState } from "react";

interface LoggedContextType {
  userLoggedIn: boolean | null;
  setUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  errorLoggedIn: boolean | null;
  setErrorLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoggedContext = createContext<LoggedContextType>({
  userLoggedIn: null,
  setUserLoggedIn: () => {},
  errorLoggedIn: null,
  setErrorLoggedIn: () => {},
});

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const LoggedProvider = ({ children }: Props) => {
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [errorLoggedIn, setErrorLoggedIn] = useState<boolean>(false);

  return (
    <LoggedContext.Provider
      value={{ userLoggedIn, setUserLoggedIn, errorLoggedIn, setErrorLoggedIn }}
    >
      {children}
    </LoggedContext.Provider>
  );
};
