import { createContext } from 'react';

interface AuthContextData {
  name: string;
}

/** Cria contexto */
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export default AuthContext;
