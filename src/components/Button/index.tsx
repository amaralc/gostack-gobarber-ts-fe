import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

/** Define tipo (interface vazia ou baseada em outro tipo) do botao */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => {
  return (
    <Container type="button" {...rest}>
      {loading ? 'Carregando...' : children}
    </Container>
  );
};

export default Button;
