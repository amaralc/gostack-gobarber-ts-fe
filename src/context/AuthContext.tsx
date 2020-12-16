import React, { createContext, useCallback, useState } from 'react';

import api from '../services/api';

interface AuthState {
  token: string;
  user: Record<string, unknown>;
}

interface SignInCredentials {
  email: string;
  password: string;
}

/** Formato dos dados do contexto */
interface AuthContextData {
  user: Record<string, unknown>;
  signIn(credentials: SignInCredentials): Promise<void>;
}

/** Contexto de autenticacao */
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

/** Provedor de autenticacao */
const AuthProvider: React.FC = ({ children }) => {
  /** Define estado para armazenagem dos dados do usuario */
  const [data, setData] = useState<AuthState>(() => {
    /** Por default, busca dados do localstorage */
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    /** Se encontrar dados no localstorage, retorna dados encontrados como estado inicial */
    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    /** Se nao encontrar, retorna estado inicial vazio e forca tipagem para AuthState */
    return {} as AuthState;
  });

  /** Metodo de signin recebe email e password */
  const signIn = useCallback(async ({ email, password }) => {
    /** Funcao faz conexao com api e recebe resposta */
    const response = await api.post('sessions', {
      email,
      password,
    });

    /** Busca usuario e token dos dados da resposta */
    const { token, user } = response.data;

    /** Registra dados no localstorage */
    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    /** Define estado local 'data' como dados registrados no localstorage */
    setData({ token, user });
  }, []);

  return (
    /** AuthContext provider passando valor com objeto de dados disponiveis no contexto */
    <AuthContext.Provider value={{ user: data.user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
