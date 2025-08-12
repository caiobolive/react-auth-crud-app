import React, { useMemo } from 'react';
import { Input, Table, Spin, Alert, Button, Space, Popconfirm, message } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, setCurrentPage } from '../../store/crud/crudSlice';
import { useUsersQuery } from '../../hooks/useCrudQuery';
import { useDeleteUser } from '../../hooks/useCrudMutations';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const StyledSearch = styled(Input.Search)`
  max-width: 328px;
  .ant-input-search-button {
    background-color: #ffdc00 !important;
    border-color: #ffdc00 !important;
    color: #1a1a1a !important;
    border-radius: 0 8px 8px 0 !important;

    &:hover {
      background-color: #ffe333 !important;
      border-color: #ffe333 !important;
    }

    &:active {
      background-color: #ffef8a !important;
      border-color: #ffef8a !important;
    }
  }
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: #fafafa !important;
    border-bottom: 1px solid #f0f0f0 !important;

    &:hover {
      background-color: #fafafa !important;
    }

    &.ant-table-column-sort {
      background-color: #fafafa !important;
    }

    &.ant-table-column-sort:hover {
      background-color: #fafafa !important;
    }
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0 !important;
  }

  .ant-pagination {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    margin-top: 16px !important;
  }
`;

export const Crud = () => {
  const dispatch = useDispatch();
  const { users, loading, error, searchTerm, currentPage, total, perPage } = useSelector(
    (state) => state.crud,
  );
  // Usar o hook customizado para buscar usuários com paginação
  useUsersQuery(currentPage);

  // Hook para deletar usuário
  const deleteUserMutation = useDeleteUser();

  const handleDelete = (id) => {
    deleteUserMutation.mutate(id, {
      onSuccess: () => {
        message.success('Usuário deletado com sucesso!');
      },
      onError: () => {
        message.error('Erro ao deletar usuário');
      },
    });
  };

  const onSearch = (value) => {
    dispatch(setSearchTerm(value));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const searchProps = {
    placeholder: 'Pesquisar usuários',
    allowClear: true,
    size: 'large',
    onSearch: onSearch,
    enterButton: <SearchOutlined />,
  };

  // Filtrar dados
  const filteredData = useMemo(() => {
    return users.filter(
      (user) =>
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [users, searchTerm]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Nome Completo',
      dataIndex: 'first_name',
      key: 'name',
      sorter: (a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      },
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={record.avatar}
            alt="Avatar"
            style={{ width: 32, height: 32, borderRadius: '50%' }}
          />
          <span>{`${record.first_name} ${record.last_name}`}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ['ascend', 'descend'],
    },

    {
      title: 'Ações',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => console.log('Editar usuário:', record.id)}
          />
          <Popconfirm
            title="Tem certeza que deseja deletar este usuário?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={deleteUserMutation.isPending}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
          }}
        >
          <Spin size="large" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert message="Erro ao carregar dados" description={error} type="error" showIcon />
      </Container>
    );
  }

  return (
    <Container>
      <StyledSearch {...searchProps} />
      <StyledTable
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: perPage,
          total: total,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} itens`,
          onChange: handlePageChange,
        }}
      />
    </Container>
  );
};
