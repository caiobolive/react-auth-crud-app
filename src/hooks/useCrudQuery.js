import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import {
  setUsers,
  setLoading,
  setError,
  setTotal,
  setTotalPages,
  setPerPage,
} from '../store/crud/crudSlice';
import { crudService } from '../services/crud';

export const useCrudQuery = (queryKey, queryFn, options = {}) => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    ...options,
  });

  // Sincronizar dados do React Query com Redux
  useEffect(() => {
    if (query.data) {
      if (queryKey.includes('users')) {
        // Para a query de usuários, extrair os dados da resposta paginada
        dispatch(setUsers(query.data.data || []));
        dispatch(setTotal(query.data.total || 0));
        dispatch(setTotalPages(query.data.total_pages || 1));
        dispatch(setPerPage(query.data.per_page || 6));
      } else {
        // Para outras queries
        dispatch(setUsers(query.data || []));
      }
      dispatch(setLoading(false));
    }
  }, [query.data, dispatch, queryKey]);

  // Atualizar loading state
  useEffect(() => {
    dispatch(setLoading(query.isLoading));
  }, [query.isLoading, dispatch]);

  // Atualizar error state
  useEffect(() => {
    if (query.error) {
      dispatch(setError(query.error.message));
    } else {
      dispatch(setError(null));
    }
  }, [query.error, dispatch]);

  return query;
};

// Hook específico para buscar usuários
export const useUsersQuery = (page = 1) => {
  return useCrudQuery(['users', page], () => crudService.getUsers(page), {
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true, // Mantém dados anteriores enquanto carrega novos
  });
};

// Hook específico para buscar um usuário
export const useUserQuery = (id) => {
  return useCrudQuery(['user', id], () => crudService.getUser(id), {
    enabled: !!id, // Só executa se o ID existir
    staleTime: 10 * 60 * 1000, // 10 minutos para dados individuais
  });
};
