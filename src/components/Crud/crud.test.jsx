import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { it, expect, describe, vi, beforeEach } from 'vitest';
import { Crud } from '.';
import TestWrapper from '../../../__tests__/utils/testWrapper';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useUsersQuery } from '../../hooks/useCrudQuery';
import { useDeleteUser } from '../../hooks/useCrudMutations';

// Mocks
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
  };
});

vi.mock('../../hooks/useCrudQuery', () => ({
  useUsersQuery: vi.fn(),
}));

vi.mock('../../hooks/useCrudMutations', () => ({
  useDeleteUser: vi.fn(),
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

describe('Crud Component', () => {
  const mockDispatch = vi.fn();
  const mockDeleteMutation = {
    mutate: vi.fn(),
    isPending: false,
  };

  const mockUsers = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      avatar: 'https://example.com/avatar1.jpg',
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      avatar: 'https://example.com/avatar2.jpg',
    },
    {
      id: 3,
      first_name: 'Bob',
      last_name: 'Johnson',
      email: 'bob.johnson@example.com',
      avatar: 'https://example.com/avatar3.jpg',
    },
  ];

  const mockState = {
    users: mockUsers,
    loading: false,
    error: null,
    searchTerm: '',
    currentPage: 1,
    total: 3,
    perPage: 6,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => selector({ crud: mockState }));
    vi.mocked(useUsersQuery).mockReturnValue({});
    vi.mocked(useDeleteUser).mockReturnValue(mockDeleteMutation);
  });

  it('should handle search functionality', async () => {
    render(
      <TestWrapper>
        <Crud />
      </TestWrapper>,
    );

    const searchInput = screen.getByPlaceholderText('Pesquisar usuários');
    fireEvent.change(searchInput, { target: { value: 'john' } });
    fireEvent.click(screen.getByRole('button', { name: 'search' }));

    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should filter users by search term', () => {
    useSelector.mockImplementation((selector) =>
      selector({ crud: { ...mockState, searchTerm: 'john' } }),
    );

    render(
      <TestWrapper>
        <Crud />
      </TestWrapper>,
    );

    // Deve mostrar John Doe e Bob Johnson (ambos contêm "john")
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('should filter users by email', () => {
    useSelector.mockImplementation((selector) =>
      selector({ crud: { ...mockState, searchTerm: 'jane.smith' } }),
    );

    render(
      <TestWrapper>
        <Crud />
      </TestWrapper>,
    );

    // Deve mostrar apenas Jane Smith
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
  });

  it('should handle delete user with confirmation', async () => {
    render(
      <TestWrapper>
        <Crud />
      </TestWrapper>,
    );

    // Encontrar o botão de deletar do primeiro usuário
    const deleteButtons = screen.getAllByRole('button', { name: 'delete' });
    fireEvent.click(deleteButtons[0]);

    // Simular confirmação do Popconfirm
    const confirmButton = screen.getByText('Sim');
    fireEvent.click(confirmButton);

    expect(mockDeleteMutation.mutate).toHaveBeenCalledWith(1, {
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('should show success message when user is deleted', async () => {
    render(
      <TestWrapper>
        <Crud />
      </TestWrapper>,
    );

    // Simular sucesso na deleção
    const deleteButtons = screen.getAllByRole('button', { name: 'delete' });
    fireEvent.click(deleteButtons[0]);

    const confirmButton = screen.getByText('Sim');
    fireEvent.click(confirmButton);

    // Chamar o callback de sucesso
    const onSuccessCallback = mockDeleteMutation.mutate.mock.calls[0][1].onSuccess;
    onSuccessCallback();

    expect(message.success).toHaveBeenCalledWith('Usuário deletado com sucesso!');
  });

  it('should show error message when delete fails', async () => {
    render(
      <TestWrapper>
        <Crud />
      </TestWrapper>,
    );

    // Simular erro na deleção
    const deleteButtons = screen.getAllByRole('button', { name: 'delete' });
    fireEvent.click(deleteButtons[0]);

    const confirmButton = screen.getByText('Sim');
    fireEvent.click(confirmButton);

    // Chamar o callback de erro
    const onErrorCallback = mockDeleteMutation.mutate.mock.calls[0][1].onError;
    onErrorCallback();

    expect(message.error).toHaveBeenCalledWith('Erro ao deletar usuário');
  });

  it('should show loading state on delete button when mutation is pending', () => {
    mockDeleteMutation.isPending = true;

    render(
      <TestWrapper>
        <Crud />
      </TestWrapper>,
    );

    const deleteButtons = screen.getAllByRole('button', { name: 'loading' });
    expect(deleteButtons[0]).toHaveClass('ant-btn-loading');
  });

  it('should handle edit button click', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <TestWrapper>
        <Crud />
      </TestWrapper>,
    );

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    expect(consoleSpy).toHaveBeenCalledWith('Editar usuário:', 1);

    consoleSpy.mockRestore();
  });

  it('should handle empty users list', () => {
    useSelector.mockImplementation((selector) => selector({ crud: { ...mockState, users: [] } }));

    render(
      <TestWrapper>
        <Crud />
      </TestWrapper>,
    );

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
  });

  it('should handle search with no results', () => {
    useSelector.mockImplementation((selector) =>
      selector({ crud: { ...mockState, searchTerm: 'nonexistent' } }),
    );

    render(
      <TestWrapper>
        <Crud />
      </TestWrapper>,
    );

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
  });

  it('should handle case insensitive search', () => {
    useSelector.mockImplementation((selector) =>
      selector({ crud: { ...mockState, searchTerm: 'JOHN' } }),
    );

    render(
      <TestWrapper>
        <Crud />
      </TestWrapper>,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('should handle partial name search', () => {
    useSelector.mockImplementation((selector) =>
      selector({ crud: { ...mockState, searchTerm: 'doe' } }),
    );

    render(
      <TestWrapper>
        <Crud />
      </TestWrapper>,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('should handle search with special characters', () => {
    useSelector.mockImplementation((selector) =>
      selector({ crud: { ...mockState, searchTerm: 'john.doe@example.com' } }),
    );

    render(
      <TestWrapper>
        <Crud />
      </TestWrapper>,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });
});
