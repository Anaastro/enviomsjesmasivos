import { createContext, useState } from "react";

interface UserContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  instanceId: any;
  setInstanceId: React.Dispatch<React.SetStateAction<any>>;
  isSecondSession: boolean;
  setIsSecondSession: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  instanceId: null,
  setInstanceId: () => {},
  isSecondSession: false,
  setIsSecondSession: () => {},
});

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState(null);
  const [instanceId, setInstanceId] = useState(null);
  const [isSecondSession, setIsSecondSession] = useState(false);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        instanceId,
        setInstanceId,
        isSecondSession,
        setIsSecondSession,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
