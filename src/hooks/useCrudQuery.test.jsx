import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useCrudQuery, useUsersQuery, useUserQuery } from './useCrudQuery';
import crudReducer from '../store/crud/crudSlice';

// Mock do serviço
vi.mock('../services/crud', () => ({
  crudService: {
    getUsers: vi.fn(),
    getUser: vi.fn(),
  },
}));

// Wrapper para renderizar hooks com providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
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

describe('useCrudQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful query for users', async () => {
    const mockData = {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ],
      total: 2,
      total_pages: 1,
      per_page: 6,
    };

    const mockQueryFn = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useCrudQuery(['users', 1], mockQueryFn), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
  });

  it('should handle loading state', async () => {
    const mockQueryFn = vi.fn().mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useCrudQuery(['users', 1], mockQueryFn), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should handle error state', async () => {
    const mockError = new Error('Failed to fetch users');
    const mockQueryFn = vi.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useCrudQuery(['users', 1], mockQueryFn), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });

  it('should handle non-users query data', async () => {
    const mockData = [{ id: 1, name: 'John Doe' }];
    const mockQueryFn = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useCrudQuery(['other-data'], mockQueryFn), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
  });
});

describe('useUsersQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch users with default page 1', async () => {
    const mockData = {
      data: [{ id: 1, name: 'John Doe' }],
      total: 1,
      total_pages: 1,
      per_page: 6,
    };

    const { crudService } = await import('../services/crud');
    crudService.getUsers.mockResolvedValue(mockData);

    const { result } = renderHook(() => useUsersQuery(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(crudService.getUsers).toHaveBeenCalledWith(1);
    expect(result.current.data).toEqual(mockData);
  });

  it('should fetch users with specific page', async () => {
    const mockData = {
      data: [{ id: 2, name: 'Jane Smith' }],
      total: 1,
      total_pages: 1,
      per_page: 6,
    };

    const { crudService } = await import('../services/crud');
    crudService.getUsers.mockResolvedValue(mockData);

    const { result } = renderHook(() => useUsersQuery(2), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(crudService.getUsers).toHaveBeenCalledWith(2);
    expect(result.current.data).toEqual(mockData);
  });

  it('should handle users query error', async () => {
    const mockError = new Error('Failed to fetch users');

    const { crudService } = await import('../services/crud');
    crudService.getUsers.mockRejectedValue(mockError);

    const { result } = renderHook(() => useUsersQuery(1), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});

describe('useUserQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch user when id is provided', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };

    const { crudService } = await import('../services/crud');
    crudService.getUser.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUserQuery(1), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(crudService.getUser).toHaveBeenCalledWith(1);
    expect(result.current.data).toEqual(mockUser);
  });

  it('should not fetch user when id is null', async () => {
    const { crudService } = await import('../services/crud');

    const { result } = renderHook(() => useUserQuery(null), { wrapper: createWrapper() });

    expect(crudService.getUser).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should not fetch user when id is undefined', async () => {
    const { crudService } = await import('../services/crud');

    const { result } = renderHook(() => useUserQuery(undefined), { wrapper: createWrapper() });

    expect(crudService.getUser).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should handle user query error', async () => {
    const mockError = new Error('User not found');

    const { crudService } = await import('../services/crud');
    crudService.getUser.mockRejectedValue(mockError);

    const { result } = renderHook(() => useUserQuery(999), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});
