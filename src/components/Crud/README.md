# CRUD Component com React Query e Redux

Este componente demonstra como integrar Tanstack React Query com Redux para gerenciar operações CRUD.

## Estrutura

### 1. Serviços (`src/services/crud/index.js`)

- `crudService`: Contém todas as funções para chamadas à API
- Usa o axios configurado com interceptors

### 2. Redux Store (`src/store/crud/crudSlice.jsx`)

- Gerencia o estado local dos dados
- Ações para loading, error, e dados
- Sincronização com React Query

### 3. Hooks Customizados

#### `useCrudQuery.js`

- `useCrudQuery`: Hook genérico para queries
- `useUsersQuery`: Hook específico para buscar usuários
- `useUserQuery`: Hook específico para buscar um usuário

#### `useCrudMutations.js`

- `useCreateUser`: Para criar usuários
- `useUpdateUser`: Para atualizar usuários
- `useDeleteUser`: Para deletar usuários

## Como Usar

### 1. Buscar Dados (Query)

```jsx
import { useUsersQuery } from '../../hooks/useCrudQuery';

const MyComponent = () => {
  const { currentPage } = useSelector((state) => state.crud);

  // Busca usuários com paginação
  useUsersQuery(currentPage);

  const { users, loading, error, total, perPage } = useSelector((state) => state.crud);

  // ... resto do componente
};
```

````

### 2. Criar Dados (Mutation)

```jsx
import { useCreateUser } from '../../hooks/useCrudMutations';

const MyComponent = () => {
  const createUserMutation = useCreateUser();

  const handleCreate = (userData) => {
    createUserMutation.mutate(userData);
  };
};
````

### 3. Atualizar Dados (Mutation)

```jsx
import { useUpdateUser } from '../../hooks/useCrudMutations';

const MyComponent = () => {
  const updateUserMutation = useUpdateUser();

  const handleUpdate = (id, userData) => {
    updateUserMutation.mutate({ id, userData });
  };
};
```

### 4. Deletar Dados (Mutation)

```jsx
import { useDeleteUser } from '../../hooks/useCrudMutations';

const MyComponent = () => {
  const deleteUserMutation = useDeleteUser();

  const handleDelete = (id) => {
    deleteUserMutation.mutate(id);
  };
};
```

## Benefícios da Implementação

1. **Cache Inteligente**: React Query gerencia cache automaticamente
2. **Sincronização**: Dados ficam sincronizados entre React Query e Redux
3. **Loading States**: Estados de loading gerenciados automaticamente
4. **Error Handling**: Tratamento de erros centralizado
5. **Otimistic Updates**: Possibilidade de atualizações otimistas
6. **Background Refetching**: Atualização automática em segundo plano

## Configuração

O React Query já está configurado no `main.jsx` com:

- `refetchOnWindowFocus: false`
- `retry: 1`
- Cache de 5 minutos para queries
- Cache de 10 minutos para dados individuais

## Paginação

A API suporta paginação com os seguintes parâmetros:

- `page`: Número da página (padrão: 1)
- `per_page`: Itens por página (padrão: 6)
- `total`: Total de itens
- `total_pages`: Total de páginas

A resposta da API inclui:

```json
{
  "page": 2,
  "per_page": 6,
  "total": 12,
  "total_pages": 2,
  "data": [...]
}
```
