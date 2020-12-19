import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, Error } from './styles';

/** Define propriedadas como todas as de um input html */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Name como obrigatorio */
  name: string;
  containerStyle?: Record<string, unknown>;
  /** Icone do tipo componente, opcional e com propriedades do tipo IconBaseProps */
  icon?: React.ComponentType<IconBaseProps>;
  type: string;
}

/** Define input e converte propriedade icon em Icon para react entender como componente */
const Input: React.FC<InputProps> = ({
  name,
  containerStyle = {},
  icon: Icon,
  type,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    /** Se tem valor, true, senao, false */
    setIsFilled(!!inputRef.current?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container
      style={containerStyle}
      isErrored={!!error}
      isFocused={isFocused}
      isFilled={isFilled}
      data-testid="input-container"
    >
      {Icon && <Icon size={20} />}
      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
        type={type}
      />
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Input;
