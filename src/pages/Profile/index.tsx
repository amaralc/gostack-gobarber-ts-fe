import React, { ChangeEvent, useCallback, useRef } from 'react';
import { FiUser, FiMail, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
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
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string()
              .min(6, 'No mínimo 6 dígitos')
              .required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password')], 'Confirmação incorreta'),
        });

        /** Valida formato */
        await schema.validate(data, {
          /** Aborta quando encontrar primeiro erro: falso -> aborta informando todos os erros */
          abortEarly: false,
        });

        /** Desestrutura dados */
        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        /** Constroi formData avaliando se old_password esta presente e usando spread operator */
        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        /** Atualiza perfil no servidor */
        const response = await api.put('/profile/update', formData);

        updateUser(response.data);

        /** Envia usuario para dashboard */
        history.push('/dashboard');

        /** Exibe mensagem de sucesso */
        addToast({
          type: 'success',
          title: 'Perfil atualizado!',
          description:
            'Suas informações do perfil foram atualizadas com sucesso!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          /** Busca erros de validacao em cada campo */
          const errors = getValidationErrors(err);

          /** Registra erros nos campos */
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description:
            'Ocorreu um erro ao atualizar o seu perfil, tente novamente.',
        });
      }
    },
    [addToast, history, updateUser],
  );

  /** Funcao para envio da imagem para a api */
  const handleAvatarChange = useCallback(
    /** Monitora evento */
    async (e: ChangeEvent<HTMLInputElement>) => {
      /** Se houver arquivo */
      if (e.target.files) {
        /** Cria novo formData */
        const data = new FormData();
        /** Adiciona o arquivo ao nome 'avatar' dentro de data */
        data.append('avatar', e.target.files[0]);
        /** Faz requisicao a api passando data */

        api.patch('/users/avatar', data).then(response => {
          /** Atualiza usuario */
          updateUser(response.data);

          /** Exibe toast de avatar atualizado */
          addToast({
            type: 'success',
            title: 'Avatar atualizado',
          });
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>
          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Name" type="text" />

          <Input name="email" icon={FiMail} placeholder="E-mail" type="text" />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova senha"
          />

          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmar senha"
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
