import React, { createContext, useCallback, useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import ToastContainer from '../components/ToastContainer';

/** Formato do ToastMessage */
export interface ToastMessage {
  /** id necessario para realizar o map com id unico */
  id: string;
  type?: 'info' | 'success' | 'error';
  title: string;
  description?: string;
}

/** Define formato do toast context data */
interface ToastContextData {
  /** Metodo de adicao, recebe messages com formato que exclui id */
  addToast(messages: Omit<ToastMessage, 'id'>): void;
  /** Metodo de remocao, recebe id */
  removeToast(id: string): void;
}

/** Cria toast context */
const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  /** Define estado com array de toast messages (podem ser varias) */
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  /** Define metodo para adicionar toast */
  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessage, 'id'>) => {
      /** Define id do toast */
      const id = uuid();

      /** Define toast */
      const toast = {
        id,
        type,
        title,
        description,
      };

      /** Passa estado atual, seguido do novo toast */
      setMessages(state => [...state, toast]);
    },
    [],
  );

  /** Metodo para remover toast ao clicar no 'x' */
  const removeToast = useCallback((id: string) => {
    /** Pega estado atual e define novo estado filtrando apenas mensagens com id diferente do informado */
    setMessages(state => state.filter(message => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within an ToastProvider');
  }

  return context;
}

export { ToastProvider, useToast };
