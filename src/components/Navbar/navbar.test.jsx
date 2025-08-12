import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Navbar } from '.';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import authReducer from '../../store/auth/authSlice';

// Mock do react-router
const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock do Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      userData: (state = initialState.userData || { userData: null }) => state,
      auth: authReducer,
    },
    preloadedState: initialState,
  });
};

// Wrapper para renderizar o componente com providers
const renderWithProviders = (component, initialState = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>,
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render user email when available', () => {
    const initialState = {
      userData: {
        userData: {
          user: {
            email: 'test@example.com',
          },
        },
      },
    };

    renderWithProviders(<Navbar />, initialState);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should render "Usuário" when no user data is available', () => {
    renderWithProviders(<Navbar />);

    expect(screen.getByText('Usuário')).toBeInTheDocument();
  });

  it('should show dropdown menu when user clicks on username', async () => {
    renderWithProviders(<Navbar />);

    const userName = screen.getByText('Usuário');
    fireEvent.click(userName);

    await waitFor(() => {
      expect(screen.getByText('Sair')).toBeInTheDocument();
    });
  });

  it('should handle logout when logout option is clicked', async () => {
    renderWithProviders(<Navbar />);

    // Abrir dropdown
    const userName = screen.getByText('Usuário');
    fireEvent.click(userName);

    // Clicar em "Sair"
    await waitFor(() => {
      const logoutButton = screen.getByText('Sair');
      fireEvent.click(logoutButton);
    });

    // Verificar se navigate foi chamado
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should show and hide dropdown menu correctly', async () => {
    renderWithProviders(<Navbar />);

    const userName = screen.getByText('Usuário');

    // Abrir dropdown
    fireEvent.click(userName);
    await waitFor(() => {
      expect(screen.getByText('Sair')).toBeInTheDocument();
    });

    // Fechar dropdown clicando novamente
    fireEvent.click(userName);
    await waitFor(() => {
      const dropdown = document.querySelector('.ant-dropdown');
      expect(dropdown).toHaveClass('ant-dropdown-hidden');
    });
  });

  it('should handle multiple user interactions correctly', async () => {
    const initialState = {
      userData: {
        userData: {
          user: {
            email: 'user@example.com',
          },
        },
      },
    };

    renderWithProviders(<Navbar />, initialState);

    const userName = screen.getByText('user@example.com');

    // Primeira interação - abrir dropdown
    fireEvent.click(userName);
    await waitFor(() => {
      expect(screen.getByText('Sair')).toBeInTheDocument();
    });

    // Segunda interação - fechar dropdown
    fireEvent.click(userName);
    await waitFor(() => {
      const dropdown = document.querySelector('.ant-dropdown');
      expect(dropdown).toHaveClass('ant-dropdown-hidden');
    });

    // Terceira interação - abrir novamente
    fireEvent.click(userName);
    await waitFor(() => {
      expect(screen.getByText('Sair')).toBeInTheDocument();
    });
  });

  it('should maintain dropdown state correctly', async () => {
    renderWithProviders(<Navbar />);

    const userName = screen.getByText('Usuário');
    const arrowIcon = screen.getByTestId('dropdown-arrow');

    // Estado inicial
    expect(arrowIcon).toHaveStyle({ transform: 'rotate(0deg)' });

    // Abrir dropdown
    fireEvent.click(userName);
    await waitFor(() => {
      expect(arrowIcon).toHaveStyle({ transform: 'rotate(180deg)' });
      expect(screen.getByText('Sair')).toBeInTheDocument();
    });

    // Fechar dropdown
    fireEvent.click(userName);
    await waitFor(() => {
      expect(arrowIcon).toHaveStyle({ transform: 'rotate(0deg)' });
      const dropdown = document.querySelector('.ant-dropdown');
      expect(dropdown).toHaveClass('ant-dropdown-hidden');
    });
  });

  it('should handle edge case with empty user data', () => {
    const initialState = {
      userData: {
        userData: null,
      },
    };

    renderWithProviders(<Navbar />, initialState);

    expect(screen.getByText('Usuário')).toBeInTheDocument();
  });

  it('should handle edge case with user data without email', () => {
    const initialState = {
      userData: {
        userData: {
          user: {},
        },
      },
    };

    renderWithProviders(<Navbar />, initialState);

    expect(screen.getByText('Usuário')).toBeInTheDocument();
  });
});
