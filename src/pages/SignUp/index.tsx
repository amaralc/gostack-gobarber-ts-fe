import React, { useCallback } from 'react';
import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background } from './styles';

const SignUp: React.FC = () => {
  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Container>
      <Background />
      <Content>
        <img src={logoImg} alt="GoBarber" />

        <Form onSubmit={handleSubmit}>
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

        <a href="signup">
          <FiArrowLeft />
          Voltar para logon
        </a>
      </Content>
    </Container>
  );
};

export default SignUp;
