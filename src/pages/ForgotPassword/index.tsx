import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  /** Inicializa hooks */
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  /** Define funcao a ser executada ao submeter formulario */
  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        /** Zera erros */
        formRef.current?.setErrors({});

        /** Define esquema de validacao */
        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Digite um e-mail válido')
            .required('E-mail obrigatório'),
        });

        /** Valida inputs */
        await schema.validate(data, {
          abortEarly: false,
        });

        /** Executa recuperacao de senha */

        /** Se houver erro */
      } catch (err) {
        /** Se for instancia da validacao do yup */
        if (err instanceof Yup.ValidationError) {
          /** Pega erros */
          const errors = getValidationErrors(err);

          /** Define erros nos campos */
          formRef.current?.setErrors(errors);

          return;
        }

        /** Cria toast */
        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.',
        });
      }
    },
    /** Passa dependencias do useCallback */
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button type="submit">Recuperar</Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default ForgotPassword;
