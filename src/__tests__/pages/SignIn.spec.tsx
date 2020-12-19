import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();

/** Cria mock de dependencia e retorna funcoes utilizadas */
jest.mock('react-router-dom', () => {
  return {
    /** Para useHistory, retorna funcao vazia */
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    /** Para link, retorna funcao que tem children (conteudo dentro) e repassa childrens do tipo reactnode */
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

/** Define teste de signin */
describe('SignIn Page', () => {
  it('should be able to sign in', () => {
    /** Rederiza componente e retorna debug */
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'user1@email.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.click(buttonElement);

    expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
  });
});
