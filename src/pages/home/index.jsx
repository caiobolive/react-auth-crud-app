import React from 'react';
import styled from 'styled-components';
import { Navbar } from '../../components/Navbar';
import { Crud } from '../../components/Crud';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  padding: 124px 24px 24px;
  background-color: #f5f5f5;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
`;

export const Home = () => {
  return (
    <Container>
      <Navbar />
      <Content>
        <Title>Usuários</Title>
        <Crud />
      </Content>
    </Container>
  );
};
