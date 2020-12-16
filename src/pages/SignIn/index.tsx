import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  /** Inicializa hooks */
  const formRef = useRef<FormHandles>(null);
  const { signIn } = useAuth();
  const { addToast } = useToast();

  const history = useHistory();

  /** Define funcao a ser executada ao submeter formulario */
  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        /** Zera erros */
        formRef.current?.setErrors({});

        /** Define esquema de validacao */
        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Digite um e-mail válido')
            .required('E-mail obrigatório'),
          password: Yup.string().required('Senha obrigatória'),
        });

        /** Valida inputs */
        await schema.validate(data, {
          abortEarly: false,
        });

        /** Executa signIn */
        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/dashboard');
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
          description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
        });
      }
    },
    /** Passa dependencias do useCallback */
    [signIn, addToast, history],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu logon</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Button type="submit">Entrar</Button>

            <a href="forgot">Esqueci minha senha</a>
          </Form>

          <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default SignIn;
