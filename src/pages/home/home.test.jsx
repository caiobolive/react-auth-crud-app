import React from 'react';
import { render, screen } from '@testing-library/react';
import { Home } from '.';
import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock dos componentes filhos
vi.mock('../../components/Navbar', () => ({
  Navbar: () => <div data-testid="navbar">Navbar Component</div>,
}));

vi.mock('../../components/Crud', () => ({
  Crud: () => <div data-testid="crud">Crud Component</div>,
}));

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Home component', () => {
    render(<Home />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('crud')).toBeInTheDocument();
  });
});
