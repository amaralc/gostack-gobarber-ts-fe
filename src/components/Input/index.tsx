import React, { InputHTMLAttributes, useEffect, useRef } from 'react';
import { IconBaseProps } from 'react-icons';
import { useField } from '@unform/core';

import { Container } from './styles';

/** Define propriedadas como todas as de um input html */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Name como obrigatorio */
  name: string;
  /** Icone do tipo componente, opcional e com propriedades do tipo IconBaseProps */
  icon?: React.ComponentType<IconBaseProps>;
}

/** Define input e converte propriedade icon em Icon para react entender como componente */
const Input: React.FC<InputProps> = ({ name, icon: Icon, ...rest }) => {
  const inputRef = useRef(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container>
      {Icon && <Icon size={20} />}
      <input defaultValue={defaultValue} ref={inputRef} {...rest} type="text" />
    </Container>
  );
};

export default Input;
