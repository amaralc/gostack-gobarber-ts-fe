import React, { createContext, useCallback } from 'react';

import api from '../services/api';

interface SignInCredentials {
  email: string;
  password: string;
}

/** Formato dos dados do contexto */
interface AuthContextData {
  name: string;
  signIn(credentials: SignInCredentials): Promise<void>;
}

/** Contexto de autenticacao */
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

/** Provedor de autenticacao */
const AuthProvider: React.FC = ({ children }) => {
  /** Metodo de signin recebe email e password */
  const signIn = useCallback(async ({ email, password }) => {
    /** Funcao faz conexao com api e recebe resposta */
    const response = await api.post('sessions', {
      email,
      password,
    });

    /** Utilizacao dos dados da resposta */
    console.log(response.data);
  }, []);

  return (
    /** AuthContext provider passando valor com objeto de dados disponiveis no contexto */
    <AuthContext.Provider value={{ name: 'Calil', signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
