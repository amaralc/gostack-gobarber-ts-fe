import React, { useCallback, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

/**
 * A custom hook that builds on useLocation to parse
 * the query string for you.
 * Ref: https://reactrouter.com/web/example/query-parameters
 */
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SignIn: React.FC = () => {
  /** Inicializa hooks */
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const query = useQuery();

  const history = useHistory();

  /** Define funcao a ser executada ao submeter formulario */
  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        /** Zera erros */
        formRef.current?.setErrors({});

        /** Define esquema de validacao */
        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password')],
            'Password não confere',
          ),
        });

        /** Valida inputs */
        await schema.validate(data, {
          abortEarly: false,
        });

        /** Busca password e confirmacao dos dados do formulario */
        const { password, password_confirmation } = data;

        /** Busca token dos query parameters da rota */
        const token = query.get('token');

        /** Avalia se existe token, senao retorna erro */
        if (!token) {
          throw new Error();
        }

        /** Envia requisicao */
        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        history.push('/');
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
          title: 'Erro ao resetar senha',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente.',
        });
      }
    },
    /** Passa dependencias do useCallback */
    [addToast, history, query],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmação da senha"
            />

            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default SignIn;
