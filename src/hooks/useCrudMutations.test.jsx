import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useCreateUser, useUpdateUser, useDeleteUser } from './useCrudMutations';
import crudReducer from '../store/crud/crudSlice';

// Mock do serviço
vi.mock('../services/crud', () => ({
  crudService: {
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

// Wrapper para renderizar hooks com providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const store = configureStore({
    reducer: {
      crud: crudReducer,
    },
  });

  return ({ children }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
};

describe('useCreateUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create user successfully', async () => {
    const mockUserData = { name: 'John Doe', email: 'john@example.com' };
    const mockCreatedUser = { id: 1, ...mockUserData };

    const { crudService } = await import('../services/crud');
    crudService.createUser.mockResolvedValue(mockCreatedUser);

    const { result } = renderHook(() => useCreateUser(), { wrapper: createWrapper() });

    result.current.mutate(mockUserData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(crudService.createUser).toHaveBeenCalledWith(mockUserData);
    expect(result.current.data).toEqual(mockCreatedUser);
  });

  it('should handle create user error', async () => {
    const mockUserData = { name: 'John Doe', email: 'john@example.com' };
    const mockError = new Error('Failed to create user');

    const { crudService } = await import('../services/crud');
    crudService.createUser.mockRejectedValue(mockError);

    const { result } = renderHook(() => useCreateUser(), { wrapper: createWrapper() });

    result.current.mutate(mockUserData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});

describe('useUpdateUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update user successfully', async () => {
    const userId = 1;
    const mockUserData = { name: 'John Doe Updated', email: 'john.updated@example.com' };
    const mockUpdatedUser = { id: userId, ...mockUserData };

    const { crudService } = await import('../services/crud');
    crudService.updateUser.mockResolvedValue(mockUpdatedUser);

    const { result } = renderHook(() => useUpdateUser(), { wrapper: createWrapper() });

    result.current.mutate({ id: userId, userData: mockUserData });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(crudService.updateUser).toHaveBeenCalledWith(userId, mockUserData);
    expect(result.current.data).toEqual(mockUpdatedUser);
  });

  it('should handle update user error', async () => {
    const userId = 1;
    const mockUserData = { name: 'John Doe Updated' };
    const mockError = new Error('Failed to update user');

    const { crudService } = await import('../services/crud');
    crudService.updateUser.mockRejectedValue(mockError);

    const { result } = renderHook(() => useUpdateUser(), { wrapper: createWrapper() });

    result.current.mutate({ id: userId, userData: mockUserData });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});

describe('useDeleteUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete user successfully', async () => {
    const userId = 1;
    const mockDeletedUser = { id: userId, name: 'John Doe' };

    const { crudService } = await import('../services/crud');
    crudService.deleteUser.mockResolvedValue(mockDeletedUser);

    const { result } = renderHook(() => useDeleteUser(), { wrapper: createWrapper() });

    result.current.mutate(userId);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(crudService.deleteUser).toHaveBeenCalledWith(userId);
    expect(result.current.data).toEqual(mockDeletedUser);
  });

  it('should handle delete user error', async () => {
    const userId = 1;
    const mockError = new Error('Failed to delete user');

    const { crudService } = await import('../services/crud');
    crudService.deleteUser.mockRejectedValue(mockError);

    const { result } = renderHook(() => useDeleteUser(), { wrapper: createWrapper() });

    result.current.mutate(userId);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });

  it('should handle multiple delete operations', async () => {
    const userId1 = 1;
    const userId2 = 2;

    const { crudService } = await import('../services/crud');
    crudService.deleteUser
      .mockResolvedValueOnce({ id: userId1, name: 'John Doe' })
      .mockResolvedValueOnce({ id: userId2, name: 'Jane Smith' });

    const { result } = renderHook(() => useDeleteUser(), { wrapper: createWrapper() });

    // Primeira deleção
    result.current.mutate(userId1);
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Segunda deleção
    result.current.mutate(userId2);
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(crudService.deleteUser).toHaveBeenCalledTimes(2);
    expect(crudService.deleteUser).toHaveBeenNthCalledWith(1, userId1);
    expect(crudService.deleteUser).toHaveBeenNthCalledWith(2, userId2);
  });

  it('should handle error logging', async () => {
    const userId = 1;
    const mockError = new Error('Failed to delete user');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { crudService } = await import('../services/crud');
    crudService.deleteUser.mockRejectedValue(mockError);

    const { result } = renderHook(() => useDeleteUser(), { wrapper: createWrapper() });

    result.current.mutate(userId);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(consoleSpy).toHaveBeenCalledWith('Erro ao deletar usuário:', mockError);

    consoleSpy.mockRestore();
  });
});
