import { render } from '@testing-library/react';
import React from 'react';
import SignIn from '../../pages/SignIn';

/** Cria mock de dependencia e retorna funcoes utilizadas */
jest.mock('react-router-dom', () => {
  return {
    /** Para useHistory, retorna funcao vazia */
    useHistory: jest.fn(),
    /** Para link, retorna funcao que tem children (conteudo dentro) e repassa childrens do tipo reactnode */
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

/** Define teste de signin */
describe('SignIn Page', () => {
  it('should be able to sign in', () => {
    /** Rederiza componente e retorna debug */
    const { debug } = render(<SignIn />);

    debug();
  });
});
