import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { addUser, updateUser, deleteUser } from '../store/crud/crudSlice';
import { crudService } from '../services/crud';

// Hook para criar usuário
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (userData) => crudService.createUser(userData),
    onSuccess: (data) => {
      // Invalidar e refazer a query de usuários
      queryClient.invalidateQueries({ queryKey: ['users'] });

      // Atualizar o Redux com o novo usuário
      dispatch(addUser(data));
    },
    onError: (error) => {
      console.error('Erro ao criar usuário:', error);
    },
  });
};

// Hook para atualizar usuário
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, userData }) => crudService.updateUser(id, userData),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });

      // Atualizar o Redux
      dispatch(updateUser({ id: variables.id, userData: data }));
    },
    onError: (error) => {
      console.error('Erro ao atualizar usuário:', error);
    },
  });
};

// Hook para deletar usuário
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (id) => crudService.deleteUser(id),
    onSuccess: (data, id) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });

      // Atualizar o Redux
      dispatch(deleteUser(id));
    },
    onError: (error) => {
      console.error('Erro ao deletar usuário:', error);
    },
  });
};
