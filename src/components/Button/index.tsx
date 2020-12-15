import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

/** Define tipo (interface vazia ou baseada em outro tipo) do botao */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Container type="button" {...rest}>
      {children}
    </Container>
  );
};

export default Button;
