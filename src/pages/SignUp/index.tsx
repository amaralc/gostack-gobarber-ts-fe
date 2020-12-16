import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    try {
      /** Zera erros */
      formRef.current?.setErrors({});

      /** Define formato do objeto */
      const schema = Yup.object().shape({
        /** Campo name como string, obrigatorio */
        name: Yup.string().required('Nome obrigatório'),
        /** Campo email do tipo email, obrigatorio */
        email: Yup.string()
          .email('Digite um e-mail válido')
          .required('E-mail obrigatório'),
        /** Campo password com minimo de 6 letras */
        password: Yup.string().min(6, 'No mínimo 6 dígitos'),
      });

      /** Valida formato */
      await schema.validate(data, {
        /** Aborta quando encontrar primeiro erro: falso -> aborta informando todos os erros */
        abortEarly: false,
      });
    } catch (err) {
      /** Busca erros de validacao em cada campo */
      const errors = getValidationErrors(err);

      /** Registra erros nos campos */
      formRef.current?.setErrors(errors);
    }
  }, []);

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>

            <Input name="name" icon={FiUser} placeholder="E-mail" />

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
