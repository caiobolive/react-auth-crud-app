import { Button, Flex, Form, Input, message } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../services/auth';
import { loginSuccess } from '../../store/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const LeftSide = styled.div`
  flex: 1;
  background-color: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #ddd;
  position: relative;
  overflow: hidden;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 110%;
  height: 110%;
  background-image: url('https://i.postimg.cc/QxD0ydLn/image.png');
  background-size: cover;
  background-position: 90% 50%;
  background-repeat: no-repeat;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  z-index: 1;
`;

const RightSide = styled.div`
  flex: 1;
  background-color: #f7f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px;
`;

const StyledForm = styled(Form)`
  width: 100%;

  .ant-form-item {
    margin-bottom: 24px;
  }

  .ant-form-item-label {
    font-weight: 500;
    color: #333;
  }

  .ant-input,
  .ant-input-password {
    border-radius: 8px;
    border: 1px solid #d9d9d9;
    padding: 12px 16px;
    font-size: 14px;

    &:hover,
    &:focus {
      border-color: #ffd700;
      box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.1);
    }
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 48px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  margin-top: 8px;
`;

export const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { mutate, isLoading } = useMutation({
    mutationFn: authApi,
    onSuccess: (data) => {
      dispatch(loginSuccess(data));
      message.success('Login realizado com sucesso!');
      navigate('/home');
    },
    onError: (error) => {
      if (error.message === 'Email ou senha inválidos') {
        form.setFields([
          {
            name: 'email',
            errors: ['Email ou senha inválidos'],
          },
          {
            name: 'password',
            errors: ['Email ou senha inválidos'],
          },
        ]);
      }
      message.error(error.message || 'Erro ao fazer login');
    },
  });

  const handleSubmit = (userData) => {
    mutate(userData);
  };

  return (
    <Container>
      <LeftSide>
        <BackgroundImage />
      </LeftSide>
      <RightSide>
        <StyledForm form={form} layout="vertical" autoComplete="off" onFinish={handleSubmit}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Por favor, insira seu email!' },
              { type: 'email', message: 'Por favor, insira um email válido!' },
            ]}
          >
            <Input placeholder="Seu email ou usuário" data-testid="emailInput" />
          </Form.Item>
          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
          >
            <Input.Password placeholder="Sua senha" data-testid="passwordInput" />
          </Form.Item>
          <StyledButton
            type="primary"
            htmlType="submit"
            data-testid="submitButton"
            loading={isLoading}
            disabled={isLoading}
          >
            <b>{isLoading ? 'Entrando...' : 'Entrar'}</b>
          </StyledButton>
        </StyledForm>
      </RightSide>
    </Container>
  );
};
