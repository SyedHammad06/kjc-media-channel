import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type authContextType = {
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
};

const authContextDefaultValues: authContextType = {
  userId: '',
  setUserId: () => {},
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
  return useContext(AuthContext);
}

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [userId, setUserId] = useState('');

  const value = {
    userId,
    setUserId,
  };

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
}
